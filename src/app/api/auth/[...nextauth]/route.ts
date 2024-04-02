import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from '@/libs/prisma'
import { Adapter } from "next-auth/adapters";
import * as bcrypt from 'bcrypt';


const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                return ({
                    id: profile.sub,
                    name: `${profile.given_name} ${profile.family_name}`,
                    email: profile.email,
                    emailVerified: new Date(),
                    image: profile.picture,
                    role: profile.role ?? 'user',
                })
            },
        
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@ex.com" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })
                if(!userFound) throw new Error('No user found')
                
                const matchPassword = credentials?.password && userFound.password && await bcrypt.compare(credentials?.password, userFound.password)
                if(!matchPassword) throw new Error('No user found')

                return {
                    id: userFound.id,
                    name: userFound.name,
                    email: userFound.email,
                    image: userFound.image,
                }
            }
        }),
        
    ],
    callbacks: {
        async jwt({ token, user }) {
          return { ...token, ...user };
        },
        async session({ session, token }) {
          session.user.role = token.role;
          return session;
        },
    },
    pages: {
        signIn: '/auth/login',
    }
});

export { handler as GET, handler as POST }
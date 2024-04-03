import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { Profile } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from '@/libs/prisma'
import { Adapter, AdapterUser } from "next-auth/adapters";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
      user: User;
    }
}

interface JWTWithAccessToken extends JWT {
accessToken?: string;
}

const expireSession = new Date(Date.now() + 1000 * 60 * 60)//1 hour
const expireJWT = '1h'

const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    // adapter: PrismaAdapter(prisma) as Adapter,
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

                return userFound
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, }) {
            if (user) {
                const extendedToken = token as JWTWithAccessToken;
                extendedToken.accessToken = jwt.sign({
                    id: user.id
                }, process.env.NEXT_PUBLIC_JWT_SECRET as string, { expiresIn: expireJWT }); // Puedes personalizar la duración del token
                return extendedToken;
            }
            return token;
        },
        async session({ session, token }:{
            session: any,
            token: JWT
        }) {
          session.user = token as any;
          const sessionToken = session.user.accessToken;
          const userFind = await prisma.user.findUnique({
            where: {
              email: session.user.email
            }
          })
          const sessionFind = await prisma.session.findUnique({
            where: {
              sessionToken: sessionToken
            }
          })
          await prisma.session.upsert({
            where: {
              sessionToken: sessionToken
            },
            update: {
              expires: expireSession
            },
            create: { 
              userId: userFind!.id,
              expires: expireSession,
              sessionToken: sessionToken,
            }
          });
          return session;
        },
    },
    pages: {
        signIn: '/auth/login',
    }
});
//api/auth/[...nextAuth]
export { handler as GET, handler as POST }
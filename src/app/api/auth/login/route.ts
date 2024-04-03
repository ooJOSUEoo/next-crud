import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import {prisma} from "@/libs/prisma";
import * as jwt from 'jsonwebtoken';

//api/auth/login
export async function POST(request:Request) {
    try {
        const data = await request.json();
        const expireSession = new Date(Date.now() + 1000 * 60 * 60)//1 hour
        const expireJWT = '1h'
        switch (data.type) {
            case "credentials":
                try {
                    const { email, password } = data
                    const userFound = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    if(!userFound) return NextResponse.json({message: 'User not found'}, {status: 404})
                    
                    const matchPassword = password && userFound.password && await bcrypt.compare(password, userFound.password)
                    if(!matchPassword) return NextResponse.json({message: 'Wrong password'}, {status: 401})
    
                    const token = jwt.sign({
                        id: userFound.id,
                    }, process.env.NEXT_PUBLIC_JWT_SECRET as string, { expiresIn: expireJWT });

                    const sessionCreate = await prisma.session.create({
                        data: {
                            userId: userFound.id,
                            sessionToken: token,
                            expires: expireSession
                        }
                    })
                    return NextResponse.json({ user: userFound, token }, { status: 200 });
                } catch (error) {
                    return NextResponse.json({ message: "An error occurred during login", error }, { status: 500 });
                }
                
            case "google":
                try {
                    const { email, name, image } = data
                    let userFound = await prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    });
                    if (!userFound?.id) {
                        userFound = await prisma.user.create({
                            data: {
                                email: email,
                                name: name,
                                image: image,
                            }
                        });
                    }
                    const token = jwt.sign({
                        id: userFound?.id,
                    }, process.env.NEXT_PUBLIC_JWT_SECRET as string, { expiresIn: expireJWT });

                    const sessionCreate = await prisma.session.create({
                        data: {
                            userId: userFound!.id,
                            sessionToken: token,
                            expires: expireSession
                        }
                    })    
                    
                    return NextResponse.json({ user: userFound, token }, { status: 200 });
                } catch (error) {
                    return NextResponse.json({ message: "An error occurred during login", error }, { status: 500 });
                }
                break;
            default:
                break;
        }
      } catch (error) {
        return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
      }
}
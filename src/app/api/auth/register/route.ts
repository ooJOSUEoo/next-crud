import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";
import * as bcrypt from 'bcrypt';

export async function POST(request:Request) {
    try {
        const data = await request.json();
        const foundEmail = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        })
        const foundUsername = await prisma.user.findUnique({
            where: {
                username: data.username,
            }
        })
        if(foundEmail) return NextResponse.json({error: 'Email already exists'}, {status: 400});
        if(foundUsername) return NextResponse.json({error: 'Username already exists'}, {status: 400});
        data.password = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data
        });
        const {password: _, ...userWithoutPassword} = user
        return NextResponse.json({user: userWithoutPassword}, {status: 200});
    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 500});
        }
    }
}
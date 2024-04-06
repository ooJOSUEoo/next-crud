import authenticate from "@/middlewares/authenticate";
import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'


export async function POST(request:Request) {
    const {error,status,token} = await authenticate(request);
    if (!error?.includes('expired')) return NextResponse.json({error}, {status})
    try {
        await prisma.session.delete({
            where: {
                sessionToken: token
            }
        })
        return NextResponse.json({message: 'Logout successful'}, {status: 200})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}


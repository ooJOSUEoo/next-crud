import {prisma} from "@/libs/prisma";
import { NextResponse } from 'next/server'

interface Params {
    params: {
        id: string
    }
}

export async function GET (request: Request, {params}: Params) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: params.id
            }
        })
        if(!user?.id) return NextResponse.json({message: 'User not found'}, {status: 404})
        return NextResponse.json({user}, {status: 200})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}
import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'
import { Prisma } from "@prisma/client";

interface Params {
    params: {
        id: string
    }
}

export async function GET (request: Request, {params}: Params) {
    try {
        const note = await prisma.note.findUnique({
            where: {
                id: Number(params.id)
            }
        })
        if(!note?.id) return NextResponse.json({message: 'Note not found'}, {status: 404})
        return NextResponse.json({note}, {status: 200})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}

export async function DELETE (request: Request, {params}: Params) {
    try {
        const note = await prisma.note.delete({
            where: {
                id: Number(params.id)
            }
        })
        if(!note?.id) return NextResponse.json({message: 'Note not found'}, {status: 404})
        return NextResponse.json({note, message: 'Note deleted'}, {status: 200})
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2025') 
            return NextResponse.json({message: 'Note not found'}, {status: 404})

            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}

export async function PUT (request: Request, {params}: Params) {
    try {
        const {title, content} = await request.json()
        const note = await prisma.note.update({
            where: {
                id: Number(params.id)
            },
            data: {
                title,
                content
            }
        })
        if(!note?.id) return NextResponse.json({message: 'Note not found'}, {status: 404})
        return NextResponse.json({note}, {status: 200})
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2025') 
            return NextResponse.json({message: 'Note not found'}, {status: 404})

            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}
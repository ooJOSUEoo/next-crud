import { NextResponse } from "next/server";
import {prisma} from '@/libs/prisma'
import authenticate from '@/middlewares/authenticate';


/**
 * @swagger
 * /api/notes:
 *   get:
 *     description: Returns notes
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 */
export async function GET (request: Request) {
    const {error,status} = await authenticate(request);
    if (error) return NextResponse.json({error}, {status})

    try {
        const notes = await prisma.note.findMany()
        return NextResponse.json({notes}, {status: 200})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}

/**
 * @swagger
 * /api/notes:
 *   post:
 *     description: Creates a new note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 */
export async function POST (request: Request) {
    const {error,status,userId} = await authenticate(request);
    if (error) return NextResponse.json({error}, {status})

    try {
        const {title, content} = await request.json()
        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId
            }
        })
        return NextResponse.json({note}, {status: 200})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({error: error.message}, {status: 500})
        }
    }
}


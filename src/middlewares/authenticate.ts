import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/libs/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Session } from '@prisma/client';

export default async function authenticate(request: NextRequest|Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return { error: 'Token authentication not provided', status: 401 };
  }
  try {
      // Verificar la validez del token
      const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as JwtPayload;
      if(!decodedToken.id) return { error: 'Token invalid', status: 401 }
      
      const userId = decodedToken.id

      const exitsSession = await prisma.session.findMany({
          where: {
              userId: userId,
              sessionToken: token
          }
      })
      if(exitsSession.length === 0){
        return { error:  'Does not exist a session with this token', status: 401}
      }

      return {
          userId,
          token,
          status: 200
      };
  } catch (error) {
      // Si hay un error al verificar el token (por ejemplo, el token ha caducado o la firma es inválida), devolver un error de autenticación
      if( error instanceof Error && error.name === 'TokenExpiredError') {
          return {
              error: 'The token has expired',
              status: 401
          }
      }
      else{
        return {
            error:  'Autentication failed',
            status: 401
        }
      }
  }
}

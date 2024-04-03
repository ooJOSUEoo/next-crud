import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/libs/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function authenticate(request: NextRequest|Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return { error: 'Token de autenticación no proporcionado', status: 401 };
  }
  try {
      // Verificar la validez del token
      const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as JwtPayload;
      // Si el token es válido, permitir el acceso a la API
      const userId = decodedToken.id
      return {
          userId,
          status: 200
      };
  } catch (error) {
      // Si hay un error al verificar el token (por ejemplo, el token ha caducado o la firma es inválida), devolver un error de autenticación
      return {
          error: 'Token de autenticación inválido',
          status: 401
      }
  }
}

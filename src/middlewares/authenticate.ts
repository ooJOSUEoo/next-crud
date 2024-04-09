import { NextRequest } from 'next/server';
import {prisma} from '@/libs/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Authenticates the request using a token from the headers and verifies its validity.
 *
 * @param {NextRequest|Request} request - the request object containing the token in the headers
 * @return {Promise<object>} the authentication result including user ID, token, and status
 */
export default async function authenticate(request: NextRequest|Request) {
  // Verificar si el token existe
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return { error: 'Token authentication not provided', status: 404 };
  }
  try {
      // Verificar la validez del token
      const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as JwtPayload;
      if(!decodedToken.id) return { error: 'Token invalid', token, status: 401 }
      
      // Verificar si el usuario existe
      const userId = decodedToken.id
      const userFind = await prisma.user.findUnique({
          where: {
            id: userId
          }
      })
      if(!userFind) return { error: 'User not found', token, status: 404 }

      // Verificar si el token existe
      const exitsSession = await prisma.session.findMany({
          where: {
              userId: userId,
              sessionToken: token
          }
      })
      if(exitsSession.length === 0){
        return { error:  'Does not exist a session with this token', token, status: 404}
      }

      // Devolver el resultado de la autenticación exitosa
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
              token,
              status: 401
          }
      }
      else{
        return {
            error:  'Autentication failed, error: ' + error,
            token,
            status: 401
        }
      }
  }
}

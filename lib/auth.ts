import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function verifyAuthToken(token?: string | null): AuthTokenPayload | null {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}


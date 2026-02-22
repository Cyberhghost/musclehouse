import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return secret;
}

export interface AdminTokenPayload extends JwtPayload {
  email: string;
  role: string;
}

export function signToken(payload: object): string {
  return jwt.sign(payload, getSecret(), { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookie = req.cookies.get('admin-token');
  return cookie?.value || null;
}

export function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

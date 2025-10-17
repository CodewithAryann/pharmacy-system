// src/lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { JwtPayload } from 'jsonwebtoken';

export type AuthHandler<T = JwtPayload> = (
  req: NextRequest,
  user: T
) => Promise<NextResponse>;

export async function withAuth<T extends JwtPayload = JwtPayload>(
  req: NextRequest,
  handler: AuthHandler<T>
) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token) as T | null;

  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return handler(req, decoded);
}

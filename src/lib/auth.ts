/* eslint-disable @typescript-eslint/no-explicit-any */
import { hash, compare } from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Extend JwtPayload with your custom fields
export interface AuthPayload extends JwtPayload {
  sub: string; // userId
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return compare(password, hashed);
}

// Create JWT token
export function createToken(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token and return typed payload
export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string') return null;

    const withRole = decoded as JwtPayload & { role?: string };
    if (!withRole.sub) return null;

    return {
      ...withRole,
      sub: withRole.sub as string,
      role: withRole.role ?? '',
    };
  } catch (_error) {
    return null;
  }
}

// Extract token from request headers
export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import User, { IUser } from '@/models/User';
import connectDB from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generate JWT token for a user
 */
export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token and return payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from request headers or cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookie
  const token = request.cookies.get('token')?.value;
  return token || null;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

/**
 * Middleware function to require authentication
 * Use this in API routes that need authentication
 */
export async function requireAuth(request: NextRequest): Promise<IUser | Response> {
  const user = await getAuthUser(request);

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Authentication required',
        message: 'Please login to access this resource',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return user;
}

/**
 * Middleware function to require admin role
 * Use this in API routes that need admin access
 */
export async function requireAdmin(request: NextRequest): Promise<IUser | Response> {
  const user = await getAuthUser(request);

  if (!user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Authentication required',
        message: 'Please login to access this resource',
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  if (user.role !== 'admin') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return user;
}

/**
 * Hash password helper (for consistency)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password helper
 */
export async function comparePassword(
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

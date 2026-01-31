import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
});

// POST /api/auth/signup - Create new user account
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, phone } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
          message: 'An account with this email already exists',
        },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by the model pre-save hook)
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      fragmentPoints: 0,
      addresses: [],
    });

    // Generate JWT token
    const token = generateToken(user);

    // Send welcome email (don't wait for it, send asynchronously)
    sendWelcomeEmail({
      to: user.email,
      firstName: user.firstName,
    }).catch((error) => {
      console.error('Failed to send welcome email:', error);
      // Don't fail the signup if email fails
    });

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      fragmentPoints: user.fragmentPoints,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: userResponse,
          token,
        },
        message: 'Account created successfully',
      },
      { status: 201 }
    );

    // Set cookie with token (httpOnly for security)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create account',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

# Authentication System Documentation

## Overview

Your Oiko backend now has a complete JWT-based authentication system! Users can sign up, log in, and access protected routes.

## What's Been Built

### 1. **Authentication Endpoints**

#### Signup
```
POST /api/auth/signup
```
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "Ahmad",
  "lastName": "Test",
  "phone": "+966501234567"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "Ahmad",
      "lastName": "Test",
      "fragmentPoints": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Account created successfully"
}
```

---

#### Login
```
POST /api/auth/login
```
Login with existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

#### Get Current User
```
GET /api/auth/me
```
Get authenticated user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "Ahmad",
    "lastName": "Test",
    "phone": "+966501234567",
    "fragmentPoints": 100,
    "addresses": [],
    "createdAt": "2024-01-26T00:00:00.000Z"
  }
}
```

---

#### Update Profile
```
PATCH /api/auth/me
```
Update current user's profile (requires authentication).

**Request Body:**
```json
{
  "firstName": "Ahmad Updated",
  "lastName": "Test",
  "phone": "+966509999999"
}
```

---

#### Logout
```
POST /api/auth/logout
```
Logout user (clears authentication cookie).

---

### 2. **Security Features**

✅ **Password Hashing** - bcrypt with salt
✅ **JWT Tokens** - 7-day expiration
✅ **HttpOnly Cookies** - Prevents XSS attacks
✅ **Secure Cookies** - HTTPS only in production
✅ **Input Validation** - Zod schema validation
✅ **Protected Routes** - Middleware for auth-required endpoints

---

## How to Use in Frontend

### Using the API Functions

Import from `lib/api.ts`:

```typescript
import { signup, login, logout, getCurrentUser, updateProfile } from '@/lib/api';
```

### Example: Signup

```typescript
const handleSignup = async () => {
  const response = await signup({
    email: 'user@example.com',
    password: 'securepass123',
    firstName: 'Ahmad',
    lastName: 'Test',
    phone: '+966501234567'
  });

  if (response.success) {
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
    // Save token to localStorage or state
    localStorage.setItem('token', response.data.token);
  } else {
    console.error('Signup failed:', response.error);
  }
};
```

### Example: Login

```typescript
const handleLogin = async () => {
  const response = await login({
    email: 'user@example.com',
    password: 'securepass123'
  });

  if (response.success) {
    console.log('Logged in:', response.data.user);
    localStorage.setItem('token', response.data.token);
    // Redirect to dashboard or home
  } else {
    alert(response.error);
  }
};
```

### Example: Get Current User

```typescript
const fetchUserProfile = async () => {
  const response = await getCurrentUser();

  if (response.success) {
    console.log('User profile:', response.data);
  } else {
    // User not authenticated, redirect to login
    window.location.href = '/login';
  }
};
```

### Example: Logout

```typescript
const handleLogout = async () => {
  await logout();
  localStorage.removeItem('token');
  window.location.href = '/login';
};
```

---

## Testing the API

### Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Get Current User (with token)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Environment Variables

Make sure your `.env.local` has:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=your-mongodb-connection-string
```

**Important:** Change `JWT_SECRET` to a random string in production!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Protecting Routes

Use the `requireAuth` middleware in any API route:

```typescript
import { requireAuth } from '@/lib/auth';
import { IUser } from '@/models/User';

export async function GET(request: NextRequest) {
  // Require authentication
  const authResult = await requireAuth(request);

  if (authResult instanceof Response) {
    return authResult; // Returns 401 if not authenticated
  }

  const user = authResult as IUser;

  // User is authenticated, proceed with logic
  return NextResponse.json({
    message: `Hello ${user.firstName}!`
  });
}
```

---

## Frontend Integration Steps

### 1. Create Auth Context

Create `contexts/auth-context.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, getCurrentUser, login, logout, signup } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const response = await getCurrentUser();
    if (response.success) {
      setUser(response.data);
    }
    setLoading(false);
  };

  // Implement login, signup, logout, refreshUser...

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

### 2. Add to Root Layout

Wrap your app in `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/auth-context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {/* Your other providers */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Create Login/Signup Pages

You can now build your login and signup forms using the auth context!

---

## What's Next?

1. ✅ Create Auth Context in frontend
2. ✅ Build Login/Signup UI
3. ✅ Protect checkout (require login)
4. ✅ Link orders to user accounts
5. ✅ Show user's order history
6. ✅ Sync fragment points with user account

Your authentication system is ready to use! 🎉

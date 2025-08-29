# Authentication Setup Guide

This guide will help you set up user authentication for your Next.js polling app using Supabase.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Steps

### 1. Install Dependencies

The required dependencies have already been installed:
- `@supabase/supabase-js`
- `@supabase/ssr`

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

### 3. Supabase Project Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Configure your site URL (e.g., `http://localhost:3000` for development)
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

### 4. Database Schema (Optional)

If you want to store additional user data, you can create a `profiles` table in your Supabase database:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Features Included

### Authentication Context
- `lib/auth-context.tsx` - React context for managing authentication state
- `useAuth()` hook for accessing user data and auth functions

### Authentication Pages
- `/auth/login` - Login page with email/password
- `/auth/register` - Registration page with validation
- `/auth` - Redirects to login page

### Protected Routes
- `components/protected-route.tsx` - Component wrapper for protected pages
- `middleware.ts` - Server-side route protection
- Example protected page at `/profile`

### Navigation
- Updated navigation component with user state
- Sign in/out functionality
- User email display

## Usage Examples

### Protecting a Route

```tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Using Authentication in Components

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'

export default function MyComponent() {
  const { user, signOut } = useAuth()

  if (!user) {
    return <div>Please sign in</div>
  }

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## Security Features

- Server-side authentication checks via middleware
- Client-side route protection
- Automatic redirects for unauthenticated users
- Session management with Supabase
- Email verification support

## Next Steps

1. Set up your Supabase project and add the environment variables
2. Test the authentication flow
3. Customize the UI components as needed
4. Add additional user profile fields if required
5. Implement password reset functionality if needed

## Troubleshooting

- Make sure your Supabase project URL and anon key are correct
- Check that your redirect URLs are properly configured in Supabase
- Ensure your environment variables are loaded correctly
- Check the browser console for any authentication errors

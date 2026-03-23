import { NextRequest } from 'next/server';
import { createAuthClient } from './supabase';

export interface AuthResult {
  success: boolean;
  user?: { id: string; email: string };
  accessToken?: string;
  error?: string;
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return { success: false, error: 'Missing Authorization header' };
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { success: false, error: 'Invalid Authorization header format' };
  }

  const accessToken = parts[1];

  try {
    const authClient = createAuthClient(accessToken);
    const { data, error } = await authClient.auth.getUser();

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Invalid or expired token' };
    }

    return {
      success: true,
      user: { id: data.user.id, email: data.user.email || '' },
      accessToken,
    };
  } catch {
    return { success: false, error: 'Token verification failed' };
  }
}

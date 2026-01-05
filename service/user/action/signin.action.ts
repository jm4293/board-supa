'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export interface SigninActionParams {
  email: string;
  password: string;
}

export async function signinAction(params: SigninActionParams) {
  const { email, password } = params;
  try {
    // redirect 옵션을 false로 설정하여 클라이언트에서 처리
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message };
    }
    throw error;
  }
}

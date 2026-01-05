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
      return {
        success: false,
        error: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    return {
      success: false,
      error: '알 수 없는 오류가 발생했습니다.',
    };
  }
}

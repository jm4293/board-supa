'use server';

import { redirect } from 'next/navigation';

import { hashPassword } from '@/share/utils/password';

export interface FormState {
  error?: string;
}

export async function registerUser(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const passwordConfirm = formData.get('passwordConfirm') as string;

  if (!username || !username.trim()) {
    return {
      error: '이름을 입력해주세요',
    };
  }

  if (username.trim().length < 2) {
    return {
      error: '이름은 최소 2자 이상이어야 합니다',
    };
  }

  if (!email || !email.trim()) {
    return {
      error: '이메일을 입력해주세요',
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: '올바른 이메일 형식이 아닙니다',
    };
  }

  if (!password || !password.trim()) {
    return {
      error: '비밀번호를 입력해주세요',
    };
  }

  if (!/^\d+$/.test(password)) {
    return {
      error: '비밀번호는 숫자만 입력 가능합니다',
    };
  }

  if (password.length < 4) {
    return {
      error: '비밀번호는 최소 4자리 이상이어야 합니다',
    };
  }

  if (!passwordConfirm || password !== passwordConfirm) {
    return {
      error: '비밀번호가 일치하지 않습니다',
    };
  }

  const agreeTerms = formData.get('agreeTerms');
  if (!agreeTerms) {
    return {
      error: '이용약관에 동의해주세요',
    };
  }

  try {
    redirect('/auth/login');
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다';
    return {
      error: errorMessage,
    };
  }
}

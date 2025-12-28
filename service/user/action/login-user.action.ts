'use server';

import { API_URL } from '@/config/nestjs/api';

export interface LoginUserActionParams {
  email: string;
  password: string;
}

export const loginUserAction = async (params: LoginUserActionParams) => {
  const { email, password } = params;

  try {
    const response = await fetch(`${API_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: result.message || '로그인에 실패했습니다',
      };
    }

    return {
      success: true,
      data: result as { accessToken: string },
      message: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        message: `로그인 중 오류가 발생했습니다: ${error.message}`,
      };
    }
    return {
      success: false,
      data: null,
      message: '로그인 중 오류가 발생했습니다',
    };
  }
};

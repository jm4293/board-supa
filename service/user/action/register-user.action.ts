'use server';

import { API_URL } from '@/config/nestjs/api';

import { UserAccountModel, UserModel } from '../model';

export interface RegisterUserActionParams {
  username: string;
  email: string;
  password: string;
}

export const registerUserAction = async (params: RegisterUserActionParams) => {
  const { username, email, password } = params;

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        nickname: username,
        email,
        password,
        provider: 0,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: result.message || '회원가입에 실패했습니다',
      };
    }

    return {
      success: true,
      data: result as { user: UserModel; userAccount: UserAccountModel },
      message: null,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        message: `회원가입 중 오류가 발생했습니다: ${error.message}`,
      };
    }
    return {
      success: false,
      data: null,
      message: '회원가입 중 오류가 발생했습니다',
    };
  }
};

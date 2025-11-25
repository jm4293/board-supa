'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { passwordUtil } from '@/share/utils';
import { jwtUtil } from '@/share/utils/auth';
import { cookieUtil } from '@/share/utils/cookie';

export interface LoginUserActionParams {
  email: string;
  password: string;
}

export const loginUserAction = async (params: LoginUserActionParams): Promise<ResponseType<{ token: string }>> => {
  const { email, password } = params;

  const supabase = await createClient();

  try {
    const userAccount = await supabase.from(DATABASE_TABLE.USER_ACCOUNT).select('*').eq('email', email).single();

    if (!userAccount.data) {
      throw new Error('User not found');
    }

    const isValid = await passwordUtil.comparePassword(password, userAccount.data.password);

    if (!isValid) {
      return {
        success: false,
        data: null,
        message: '비밀번호가 일치하지 않습니다',
      };
    }

    const user = await supabase.from(DATABASE_TABLE.USER).select('*').eq('id', userAccount.data.userId).single();

    if (!user.data) {
      throw new Error('User not found');
    }

    // JWT 토큰 생성
    const accessToken = jwtUtil.generateAccessToken(user.data.id, user.data.email);
    const refreshToken = jwtUtil.generateRefreshToken(user.data.id, user.data.email);

    // 쿠키에 토큰 저장
    await cookieUtil.setAccessToken(accessToken);
    await cookieUtil.setRefreshToken(refreshToken);

    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

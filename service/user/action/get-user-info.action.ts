'use server';

import { cookies } from 'next/headers';

import { SESSION_TOKEN_NAME } from '@/share/const';
import { jwtUtil } from '@/share/utils';

export const getUserInfoAction = async () => {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(SESSION_TOKEN_NAME);

  if (!sessionToken) {
    return {
      success: false,
      data: null,
      message: '세션 토큰이 없습니다',
    };
  }

  const tokenData = jwtUtil.verify(sessionToken.value);

  if (!tokenData) {
    return {
      success: false,
      data: null,
      message: '사용자 정보를 찾을 수 없습니다',
    };
  }

  return {
    success: true,
    data: tokenData,
    message: null,
  };
};

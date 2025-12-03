'use server';
import { JwtPayload } from 'jsonwebtoken';

import { ResponseType } from '@/share/type/response.type';
import { cookieUtil } from '@/share/utils/cookie';
import { jwtUtil } from '@/share/utils/jwt';

export const checkLoginAction = async (): Promise<ResponseType<JwtPayload | string>> => {
  try {
    /* 쿠키 조회 */
    const sessionToken = await cookieUtil.getSessionToken();

    if (!sessionToken) {
      return {
        success: false,
        data: null,
        message: '로그인이 필요합니다',
      };
    }

    /* 쿠키 유효성 검사 */
    const isValid = await cookieUtil.validateSessionToken();

    if (!isValid) {
      return {
        success: false,
        data: null,
        message: '쿠키가 만료되었습니다',
      };
    }

    const userInfo = await jwtUtil.decode(sessionToken);

    return {
      success: true,
      data: userInfo,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

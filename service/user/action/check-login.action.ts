'use server';
import { ResponseType } from '@/share/type/response.type';
import { cookieUtil } from '@/share/utils/cookie';

export const checkLoginAction = async (): Promise<ResponseType> => {
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

    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

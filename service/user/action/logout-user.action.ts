'use server';

import { ResponseType } from '@/share/type/response.type';
import { cookieUtil } from '@/share/utils/cookie';

export const logoutUserAction = async (): Promise<ResponseType> => {
  try {
    await cookieUtil.clearAllTokens();

    return {
      success: true,
      data: null,
      message: '로그아웃이 완료되었습니다',
    };
  } catch (error) {
    throw error;
  }
};
import { cookies } from 'next/headers';

import { jwtUtil } from './jwt';

const SESSION_TOKEN_COOKIE_NAME = 'session-token';

export const cookieUtil = {
  /**
   * 쿠키 저장
   */
  setSessionToken: async (token: string, maxAge?: number) => {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge ?? 10 * 60 * 1000,
      path: '/',
    });
  },


  /**
   * 쿠키 조회
   */
  getSessionToken: async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_TOKEN_COOKIE_NAME)?.value ?? null;
  },


  /**
   * 쿠키 유효성 검사
   */
  validateSessionToken: async () => {
    const sessionToken = await cookieUtil.getSessionToken();
    if (!sessionToken) {
      return false;
    }
    if (jwtUtil.verify(sessionToken)) {
      return sessionToken !== null && jwtUtil.verify(sessionToken);
    }
    return sessionToken !== null;
  },

  /**
   * Token 삭제
   */
  clearAllTokens: async () => {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_TOKEN_COOKIE_NAME);
  },
};

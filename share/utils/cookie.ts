import { cookies } from 'next/headers';

import { jwtUtil } from './auth';

const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';

export const cookieUtil = {
  /**
   * 쿠키 저장
   */
  setAccessToken: async (token: string, maxAge?: number) => {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge ?? 10 * 60 * 1000,
      path: '/',
    });
  },

  setRefreshToken: async (token: string, maxAge?: number) => {
    const cookieStore = await cookies();
    cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge ?? 1 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  },
  /**
   * 쿠키 조회
   */
  isCookieExists: async (): Promise<boolean> => {
    const cookieStore = await cookies();
    return (
      cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value !== null ||
      cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value !== null
    );
  },
  getAccessToken: async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  },
  getRefreshToken: async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value ?? null;
  },

  /**
   * 쿠키 유효성 검사
   */
  validateAccessToken: async () => {
    const accessToken = await cookieUtil.getAccessToken();
    if (!accessToken) {
      return false;
    }
    if (jwtUtil.verifyToken(accessToken)) {
      return accessToken !== null && jwtUtil.verifyToken(accessToken);
    }
    return accessToken !== null;
  },
  validateRefreshToken: async () => {
    const refreshToken = await cookieUtil.getRefreshToken();
    return refreshToken !== null && jwtUtil.verifyToken(refreshToken);
  },

  /**
   * Token 삭제
   */
  clearAllTokens: async () => {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE_NAME);
    cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  },
};

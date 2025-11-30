import { cookies } from 'next/headers';

import { SESSION_TOKEN_EXPIRE, SESSION_TOKEN_NAME } from '@/share/const';
import { jwtUtil } from '@/share/utils/jwt';

const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7일

export interface SessionData {
  userId: number;
  username: string;
  email: string;
}

export interface SetSessionTokenParams {
  email: string;
  userAccountId: number;
  provider: number;
  nickname: string;
}

/**
 * JWT 기반 세션 토큰을 생성하고 쿠키에 저장합니다.
 * Server Action에서 사용할 수 있습니다.
 */
export async function setSessionToken(params: SetSessionTokenParams): Promise<void> {
  const sessionToken = jwtUtil().sign({ ...params }, SESSION_TOKEN_EXPIRE);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_TOKEN_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TOKEN_EXPIRE,
    path: '/',
  });
}

export async function createSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

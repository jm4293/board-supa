import { SignOptions } from 'jsonwebtoken';

import { cookieUtil } from './cookie';
import { jwtUtil } from './jwt';

export interface JwtPayload {
  userAccountId: number;
  email: string;
  nickname: string;
  provider: number;
}

export const authUtil = {
  /**
   * JWT session token 생성 및 쿠키에 저장
   */
  async setSession(params: JwtPayload, options?: SignOptions) {
    const token = jwtUtil.sign(params, options);
    await cookieUtil.setSessionToken(token);
  },
  async getSession() {
    const tokenValue = await cookieUtil.getSessionToken();
    if (!tokenValue) {
      return null;
    }
    return tokenValue;
  },
  async deleteSession() {
    await cookieUtil.clearAllTokens();
  },
};

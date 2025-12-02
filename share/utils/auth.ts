import jwt, { SignOptions } from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
}

const ACCESS_TOKEN_EXPIRES_IN = '10m';
const REFRESH_TOKEN_EXPIRES_IN = '1d';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export const jwtUtil = {
  /**
   * JWT access token 생성
   */
  generateAccessToken(id: number, email: string): string {
    const payload: JwtPayload = {
      id,
      email,
    };

    const secret = JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const expiresIn = ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];

    const options: SignOptions = {
      expiresIn,
    };

    return jwt.sign(payload, secret, options);
  },
  /**
   * JWT refresh token 생성
   */
  generateRefreshToken(id: number, email: string): string {
    const payload: JwtPayload = {
      id,
      email,
    };

    const secret = JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not definedddddd');
    }

    const expiresIn = REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
    const options: SignOptions = {
      expiresIn,
    };

    return jwt.sign(payload, secret, options);
  },

  /** 
   * JWT 토큰 검증
   */
  verifyToken(token: string): JwtPayload {
    const secret = JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // eslint-disable-next-line no-console
        console.log('Token expired: ', error);
        throw error;
      }
      throw new Error('Invalid token');
    }
  },

  /**
   * JWT 토큰 디코딩 (검증 없이)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  },
};

/**
 * 세션 정보 가져오기
 */
export async function getSession() {
  const { cookieUtil } = await import('./cookie');
  const accessToken = await cookieUtil.getAccessToken();

  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwtUtil.verifyToken(accessToken);
    return {
      id: payload.id,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

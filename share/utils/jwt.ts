import jwt from 'jsonwebtoken';

import { SetSessionTokenParams } from './auth';

export interface IVerifiedToken extends SetSessionTokenParams {}

export const jwtUtil = (): {
  sign: (payload: any, expiresIn: number) => string;
  verify: (token: string) => IVerifiedToken;
} => {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY!;

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return {
    sign: (payload: any, expiresIn: number) => {
      return jwt.sign(payload, secretKey, {
        expiresIn,
        algorithm: 'HS256',
        issuer: 'localhost:3000',
        audience: 'localhost:3000',
        jwtid: generateUniqueId(),
      });
    },
    verify: (token: string) => {
      return jwt.verify(token, secretKey) as IVerifiedToken;
    },
  };
};

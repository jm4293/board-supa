import jwt from 'jsonwebtoken';

import { SetSessionTokenParams } from './auth';

export interface IVerifiedToken extends SetSessionTokenParams {}

const secretKey = '3f8b2e1a9c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7A8B9C0D1';

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const jwtUtil = {
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

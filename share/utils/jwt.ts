import jwt, { SignOptions } from "jsonwebtoken";


const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

const getSecret = (): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return JWT_SECRET;
};

export const jwtUtil = {
  sign: (payload: object, options?: SignOptions): string => {
    return jwt.sign(payload, getSecret(), options);
  },
  verify: (token: string) => {
    return jwt.verify(token, getSecret());
  },
  decode: (token: string) => {
    return jwt.decode(token);
  },
};
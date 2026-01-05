import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Kakao from 'next-auth/providers/kakao';
import { object, string } from 'zod';

import { loginUserAction } from '@/service/user/action/login-user.action';

export const signInSchema = object({
  email: string().min(1, 'Email is required').email('Invalid email'),
  password: string().min(4, 'Password must be more than 4 characters'),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 폼 검증
          const { email, password } = await signInSchema.parseAsync(credentials);

          const emailString = email as string;
          const passwordString = password as string;

          const response = await loginUserAction({ email: emailString, password: passwordString });

          if (response.success && response.data) {
            const { accessToken } = response.data;
            return {
              email: emailString,
              name: emailString.split('@')[0] || emailString, // 이메일의 @ 앞부분을 이름으로 사용
              accessToken: accessToken,
            };
          }

          // 로그인 실패 시 null 반환 (Error 객체 반환 금지)
          return null;
        } catch {
          throw new CredentialsSignin();
        }
      },
    }),
    // @ts-expect-error - NextAuth v5 자동 환경 변수 추론 (AUTH_KAKAO_ID, AUTH_KAKAO_SECRET)
    Kakao(),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    signIn: async () => {
      return true;
    },
    jwt: async ({ token, user }) => {
      // 처음 로그인할 때 user 객체에서 accessToken을 token에 저장
      if (user) {
        const userWithToken = user as typeof user & { accessToken?: string };
        if (userWithToken.accessToken) {
          token.accessToken = userWithToken.accessToken;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
        accessToken: token.accessToken as string | undefined,
      };
    },
    authorized: async () => {
      // 사용자 인증 여부 확인
      // 모든 페이지 공개
      return true;
    },
  },
});

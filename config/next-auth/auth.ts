import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Kakao from 'next-auth/providers/kakao';

import { loginUserAction } from '@/service/user/action/login-user.action';

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new CredentialsSignin();
        }

        const emailString = email as string;
        const passwordString = password as string;

        const response = await loginUserAction({ email: emailString, password: passwordString });

        if (response.success && response.data) {
          const { accessToken } = response.data;
          return {
            email: emailString,
            name: emailString,
            accessToken: accessToken,
          };
        }

        return null;
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
    redirect: async () => {
      return '/home';
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
      return true;
    },
  },
});

export { handlers, auth, signIn, signOut };

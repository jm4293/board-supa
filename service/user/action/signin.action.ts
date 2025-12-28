'use server';

import { signIn } from '@/config/next-auth/auth';

export async function signinAction(email: string, password: string) {
  await signIn('credentials', {
    email,
    password,
    redirectTo: '/home',
  });
}

'use server';

import { cookies } from 'next/headers';

import { SESSION_TOKEN_NAME } from '@/share/const';

export const logoutAction = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_TOKEN_NAME);

  return {
    success: true,
    data: null,
    message: null,
  };
};

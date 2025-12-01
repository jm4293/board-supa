'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { passwordUtil, setSessionToken } from '@/share/utils';

import { UserAccountModel, UserModel } from '..';

export interface LoginUserActionParams {
  email: string;
  password: string;
}

export const loginUserAction = async (params: LoginUserActionParams): Promise<ResponseType> => {
  const { email, password } = params;

  const supabase = await createClient();

  const userAccount = await supabase
    .from(DATABASE_TABLE.USER_ACCOUNT)
    .select('*')
    .eq('email', email)
    .single<UserAccountModel>();

  if (!userAccount.data || !userAccount.data.email || !userAccount.data.password) {
    return {
      success: false,
      data: null,
      message: '사용자를 찾을 수 없습니다',
    };
  }

  const isValid = await passwordUtil.comparePassword(password, userAccount.data.password);

  if (!isValid) {
    return {
      success: false,
      data: null,
      message: '비밀번호가 일치하지 않습니다',
    };
  }

  const user = await supabase
    .from(DATABASE_TABLE.USER)
    .select('*')
    .eq('id', userAccount.data.userId)
    .single<UserModel>();

  if (!user.data) {
    return {
      success: false,
      data: null,
      message: '사용자를 찾을 수 없습니다',
    };
  }

  await setSessionToken({
    email: userAccount.data.email,
    userAccountId: userAccount.data.id,
    provider: userAccount.data.provider,
    nickname: user.data.nickname,
  });

  return {
    success: true,
    data: null,
    message: null,
  };
};

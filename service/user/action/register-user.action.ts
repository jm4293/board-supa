'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { passwordUtil } from '@/share/utils';

import { UserAccountModel, UserModel } from '../model';

export interface RegisterUserActionParams {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export const registerUserAction = async (
  params: RegisterUserActionParams,
): Promise<ResponseType<{ user: UserModel; userAccount: UserAccountModel }>> => {
  const { username, email, password } = params;

  const supabase = await createClient();

  try {
    const newUser = await supabase
      .from(DATABASE_TABLE.USER)
      .insert<Pick<UserModel, 'username' | 'nickname' | 'profileImage' | 'status'>>({
        username,
        nickname: username,
        profileImage: null,
        status: 1,
      })
      .select('*')
      .single();

    const newUserAccount = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .insert<Pick<UserAccountModel, 'userId' | 'email' | 'password' | 'provider'>>({
        userId: newUser.data?.id,
        email,
        password: await passwordUtil.hashPassword(password),
        provider: 1,
      })
      .select('*')
      .single();

    return {
      success: true,
      data: {
        user: newUser.data,
        userAccount: newUserAccount.data,
      },
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

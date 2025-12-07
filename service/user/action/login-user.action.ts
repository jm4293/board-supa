'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { authUtil } from '@/share/utils/auth';
import { passwordUtil } from '@/share/utils';
import { UserAccountModel, UserModel } from '../model';

export interface LoginUserActionParams {
  email: string;
  password: string;
}

export const loginUserAction = async (params: LoginUserActionParams): Promise<ResponseType<{ token: string }>> => {
  const { email, password } = params;

  const supabase = await createClient();

  try {
    const userAccount = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .select('*')
      .eq('email', email)
      .single<UserAccountModel>();

    if (!userAccount.data) {
      throw new Error('이메일을 찾을 수 없습니다');
    }

    const isValid = await passwordUtil.comparePassword(password, userAccount.data.password ?? '');

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
      throw new Error('사용자를 찾을 수 없습니다');
    }

    // 사용자 계정이 있다면, JWT 세션 생성
    const sessionToken = await authUtil.setSession({
      userAccountId: userAccount.data.id,
      email: userAccount.data.email ?? '',
      nickname: user.data.nickname ?? '',
      provider: userAccount.data.provider,
    });

    return {
      success: true,
      data: sessionToken ?? null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

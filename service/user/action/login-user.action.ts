'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { passwordUtil } from '@/share/utils';

export const loginUserAction = async (formData: FormData): Promise<ResponseType> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  try {
    const userAccount = await supabase.from(DATABASE_TABLE.USER_ACCOUNT).select('*').eq('email', email).single();

    if (!userAccount.data) {
      throw new Error('User not found');
    }

    const isValid = await passwordUtil.comparePassword(password, userAccount.data.password);

    if (!isValid) {
      return {
        success: false,
        data: null,
        message: '비밀번호가 일치하지 않습니다',
      };
    }

    const user = await supabase.from(DATABASE_TABLE.USER).select('*').eq('id', userAccount.data.userId).single();

    return {
      success: true,
      data: null,
      message: null,
    };
  } catch (error) {
    throw error;
  }
};

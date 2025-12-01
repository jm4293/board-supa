'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI, KAKAO_REST_API_KEY } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { setSessionToken } from '@/share/utils/auth';

import { UserAccountModel, UserModel } from '..';

export const kakaoLoginAction = async (code: string): Promise<ResponseType> => {
  const tokenResponse = await fetch(
    `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}&client_secret=${KAKAO_CLIENT_SECRET}`,
    { method: 'GET' },
  );

  if (!tokenResponse.ok) {
    return {
      success: false,
      data: null,
      message: '카카오 로그인에 실패했습니다',
    };
  }

  const { access_token } = await tokenResponse.json();

  const userResponse = await fetch('https://kapi.kakao.com/v2/user/me?secure_resource=false', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!userResponse.ok) {
    return {
      success: false,
      data: null,
      message: '카카오 사용자 정보를 가져오는데 실패했습니다',
    };
  }

  const userResponseData = await userResponse.json();
  const { kakao_account } = userResponseData;
  const { email, profile } = kakao_account;
  const { nickname, profile_image_url } = profile;

  const supabase = await createClient();

  const userAccount = await supabase
    .from(DATABASE_TABLE.USER_ACCOUNT)
    .select('*')
    .eq('email', email)
    .single<UserAccountModel>();

  // 사용자 정보가 없으면 사용자 신규가입 진행
  if (!userAccount.data) {
    const newUser = await supabase
      .from(DATABASE_TABLE.USER)
      .insert<Pick<UserModel, 'username' | 'nickname' | 'profileImage' | 'status'>>({
        username: nickname,
        nickname: nickname,
        profileImage: profile_image_url,
        status: 1,
      })
      .select('*')
      .single();

    const newUserAccount = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .insert<Pick<UserAccountModel, 'userId' | 'email' | 'password' | 'provider'>>({
        userId: newUser.data?.id,
        email,
        password: null,
        provider: 2,
      })
      .select('*')
      .single();

    await setSessionToken({
      email,
      userAccountId: newUserAccount.data.id,
      provider: newUserAccount.data.provider,
      nickname: newUser.data.nickname,
    });

    return {
      success: true,
      data: null,
      message: null,
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
    email,
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

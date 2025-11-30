'use client';

import { useEffect } from 'react';

import { useUserMutation } from '@/service/user';

export default function KakaoLogin({ code }: { code: string }) {
  const { kakaoLogin } = useUserMutation();

  useEffect(() => {
    if (!code) {
      return;
    }

    kakaoLogin.mutate(code);
  }, [code]);

  return <div>카카오 로그인 진행 중</div>;
}

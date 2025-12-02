'use client';

import { useEffect } from 'react';

import { useUserMutation } from '@/service/user/mutation';

export default function KakaoLogin({ code }: { code: string }) {
  const { requestKakaoToken } = useUserMutation();

  useEffect(() => {
    if (!code) {
      return;
    }

    requestKakaoToken.mutate(code);
  }, [code]);

  if (!code) {
    return <div>카카오 로그인 실패: 코드가 없습니다</div>;
  }

  return <div>카카오 로그인 중... 잠시만 기다려주세요.</div>;
}

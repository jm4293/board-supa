'use client';

import { useEffect, useRef } from 'react';

import { useUserMutation } from '@/service/user/hooks';

export default function KakaoLogin({ code }: { code: string }) {
  const { requestKakaoToken } = useUserMutation();
  const hasMutated = useRef(false);

  useEffect(() => {
    if (code && !hasMutated.current) {
      hasMutated.current = true;
      requestKakaoToken.mutate(code);
    }
  }, [code, requestKakaoToken]);

  if (!code) {
    return <div>카카오 로그인 실패: 코드가 없습니다</div>;
  }

  return <div>카카오 로그인 중... 잠시만 기다려주세요.</div>;
}
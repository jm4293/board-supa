'use client';

import { useEffect, useRef } from 'react';

import { useUserMutation } from '@/service/user/mutation';

export default function KakaoLogin({ code }: { code: string }) {
  const { requestKakaoToken } = useUserMutation();
  const hasMutated = useRef(false);

  useEffect(() => {
    // Strict Mode에서 두 번 실행되는 것을 방지 (code는 일회용)
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
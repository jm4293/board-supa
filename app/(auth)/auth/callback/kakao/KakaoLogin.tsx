'use client';

import { useEffect } from 'react';

export default function KakaoLogin() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      (async () => {
        const response = await fetch('/api/login/kakao', {
          method: 'POST',
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
      })();
    }
  }, []);

  return <div>카카오 로그인 진행 중</div>;
}

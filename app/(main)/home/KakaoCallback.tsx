'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useUserMutation } from '@/service/user/mutation';

/**
 * 카카오 토큰 요청 콜백 컴포넌트
 */
export default function KakaoCallback() {
    const searchParams = useSearchParams();
    const { requestKakaoToken } = useUserMutation();

    useEffect(() => {
        const code = searchParams.get('code');

        if (code) {
            requestKakaoToken.mutate(code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return null;
}

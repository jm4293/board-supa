'use client';
import { useSession } from 'next-auth/react';

import { ResponseType } from '@/share/type/response.type';

export const useCheckLogin = (): ResponseType<any> => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return {
            success: false,
            data: null,
            message: '로딩 중...',
        };
    }

    if (status === 'unauthenticated' || !session) {
        return {
            success: false,
            data: null,
            message: '로그인이 필요합니다',
        };
    }

    // 로그인 됨
    return {
        success: true,
        data: session.user,
        message: null,
    };
};
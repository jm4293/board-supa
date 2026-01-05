'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/component/common';
import { useSession } from 'next-auth/react';

/**
 * 게시글 작성 버튼 컴포넌트
 * 로그인 여부를 확인하여 로그인되어 있으면 작성 페이지로 이동,
 * 로그인되어 있지 않으면 alert를 표시합니다.
 */
export default function BoardWriteButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleClick = async () => {
        try {
            if (session) {
                router.push('/board/write');
            } else {
                alert('로그인 해주세요');
            }
        } catch (error) {
            alert('로그인 해주세요');
        }
    };

    return (
        <Button variant="primary" onClick={handleClick}>
            글쓰기
        </Button>
    );
}


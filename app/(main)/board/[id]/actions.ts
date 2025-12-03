'use server';

import { redirect } from 'next/navigation';

import { authUtil } from '@/share/utils';

export async function deleteBoard(formData: FormData) {
  const boardId = parseInt(formData.get('boardId') as string);

  if (isNaN(boardId)) {
    throw new Error('유효하지 않은 게시글 ID입니다');
  }

  const session = await authUtil.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  try {
    redirect('/board');
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    throw new Error('게시글 삭제에 실패했습니다');
  }
}

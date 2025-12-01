'use server';

import { createBoardAction } from '@/service/board/action';

export async function createBoard(formData: FormData) {
  const result = await createBoardAction(formData);

  if (!result.success) {
    throw new Error(result.message || '게시글 작성에 실패했습니다');
  }
}

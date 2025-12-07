'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

export const deleteBoardAction = async (boardId: number): Promise<ResponseType> => {
  try {
    if (!boardId || isNaN(boardId)) {
      return {
        success: false,
        data: null,
        message: '유효하지 않은 게시글 ID입니다',
      };
    }

    const supabase = await createClient();

    // 게시글 조회 및 권한 확인
    const boardResponse = await supabase.from(DATABASE_TABLE.BOARD).select('*').eq('id', boardId).single();

    if (!boardResponse.data) {
      return {
        success: false,
        data: null,
        message: '게시글을 찾을 수 없습니다',
      };
    }

    const deleteResponse = await supabase.from(DATABASE_TABLE.BOARD).delete().eq('id', boardId);

    if (deleteResponse.error) {
      return {
        success: false,
        data: null,
        message: '게시글 삭제에 실패했습니다',
      };
    }

    redirect('/board');
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '게시글 삭제에 실패했습니다',
    };
  }
};

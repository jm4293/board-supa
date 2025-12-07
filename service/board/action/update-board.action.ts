'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';

import { BoardModel } from '../model';

export interface UpdateBoardActionParams {
  boardId: number;
  title: string;
  content: string;
}

export const updateBoardAction = async (boardId: number, formData: FormData) => {
  try {
    if (!boardId || isNaN(boardId)) {
      return {
        success: false,
        data: null,
        message: '유효하지 않은 게시글 ID입니다',
      };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !title.trim()) {
      return {
        success: false,
        data: null,
        message: '제목을 입력해주세요',
      };
    }

    if (!content || !content.trim()) {
      return {
        success: false,
        data: null,
        message: '내용을 입력해주세요',
      };
    }

    const supabase = await createClient();

    // 게시글 조회 및 권한 확인
    const boardResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select('*, userAccount:userAccountId(*)')
      .eq('id', boardId)
      .single();

    if (!boardResponse.data) {
      return {
        success: false,
        data: null,
        message: '게시글을 찾을 수 없습니다',
      };
    }

    // 게시글 수정
    const updateResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .update({
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', boardId)
      .select('*')
      .single<BoardModel>();

    if (!updateResponse.data) {
      return {
        success: false,
        data: null,
        message: '게시글 수정에 실패했습니다',
      };
    }

    redirect(`/board/${boardId}`);
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
      message: error instanceof Error ? error.message : '게시글 수정에 실패했습니다',
    };
  }
};

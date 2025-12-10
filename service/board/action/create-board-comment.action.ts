'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

import { BoardCommentModel } from '../model';

interface CreateBoardCommentActionParams {
  boardId: number;
  userId: number;
  content: string;
  parentId?: number | null;
}

export const createBoardCommentAction = async (
  params: CreateBoardCommentActionParams,
): Promise<ResponseType<BoardCommentModel>> => {
  try {
    const { boardId, userId, content, parentId } = params;

    if (!content || !content.trim()) {
      return {
        success: false,
        data: null,
        message: '댓글 내용을 입력해주세요',
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from(DATABASE_TABLE.BOARD_COMMENT)
      .insert({
        boardId: boardId,
        userId: userId,
        content: content.trim(),
        parentId: parentId,
        isDeleted: 0,
        deletedAt: null,
      })
      .select()
      .single<BoardCommentModel>();

    if (error) {
      return {
        success: false,
        data: null,
        message: error.message || '댓글 작성에 실패했습니다',
      };
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: '댓글 작성에 실패했습니다',
      };
    }

    return {
      success: true,
      data: data,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '댓글 작성에 실패했습니다',
    };
  }
};

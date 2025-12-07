'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

import { BoardImageModel, BoardModel } from '../model';

export interface BoardDetailModel extends BoardModel {
  boardImage?: BoardImageModel[];
}

export const getBoardDetailAction = async (boardId: number): Promise<ResponseType<BoardDetailModel>> => {
  try {
    if (!boardId || isNaN(boardId)) {
      return {
        success: false,
        data: null,
        message: '유효하지 않은 게시글 ID입니다',
      };
    }

    const supabase = await createClient();

    // 게시글 조회 (BoardImage 조인)
    const { data, error } = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select(
        `
        *,
        boardImage:${DATABASE_TABLE.BOARD_IMAGE}(*)
      `,
      )
      .eq('id', boardId)
      .eq('isDeleted', 0)
      .single<BoardDetailModel>();

    if (error || !data) {
      return {
        success: false,
        data: null,
        message: '게시글을 찾을 수 없습니다',
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
      message: error instanceof Error ? error.message : '게시글을 불러오는데 실패했습니다',
    };
  }
};

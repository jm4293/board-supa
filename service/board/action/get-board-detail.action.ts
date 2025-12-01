'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

import { BoardModel } from '../model';

export const getBoardDetailAction = async (boardId: number): Promise<ResponseType<BoardModel>> => {
  try {
    if (!boardId || isNaN(boardId)) {
      return {
        success: false,
        data: null,
        message: '유효하지 않은 게시글 ID입니다',
      };
    }

    const supabase = await createClient();

    // 게시글 조회
    const { data, error } = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select('*')
      .eq('id', boardId)
      .eq('is_deleted', 0)
      .single<BoardModel>();

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

'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

import { BoardModel } from '../model';

export interface GetBoardListActionParams {
  page?: number;
  limit?: number;
}

export interface BoardListResponse {
  boards: BoardModel[];
  total: number;
  page: number;
  limit: number;
}

export const getBoardListAction = async (
  params?: GetBoardListActionParams,
): Promise<ResponseType<BoardListResponse>> => {
  try {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // 전체 개수 조회
    const { count } = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select('*', { count: 'exact', head: true })


    // 게시글 목록 조회
    const { data, error } = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select('*')

      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return {
        success: false,
        data: null,
        message: '게시글 목록을 불러오는데 실패했습니다',
      };
    }

    return {
      success: true,
      data: {
        boards: (data as BoardModel[]) ?? [],
        total: count ?? 0,
        page,
        limit,
      },
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '게시글 목록을 불러오는데 실패했습니다',
    };
  }
};

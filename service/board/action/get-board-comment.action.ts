'use server';

import { createClient } from '@/config/supabase/server';

import { UserModel } from '@/service/user/model';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

import { BoardCommentModel } from '../model';

export interface BoardCommentWithUser extends BoardCommentModel {
  user: UserModel | null;
}

export const getBoardCommentAction = async (boardId: number): Promise<ResponseType<BoardCommentWithUser[]>> => {
  try {
    const supabase = await createClient();

    // 댓글 조회 (삭제되지 않은 댓글만)
    const commentsResult = await supabase
      .from(DATABASE_TABLE.BOARD_COMMENT)
      .select('*')
      .eq('boardId', boardId)
      .eq('isDeleted', 0)
      .order('createdAt', { ascending: true });

    if (commentsResult.error) {
      return {
        success: false,
        data: null,
        message: commentsResult.error.message || '댓글을 불러오는데 실패했습니다',
      };
    }

    if (!commentsResult.data || commentsResult.data.length === 0) {
      return {
        success: true,
        data: [],
        message: null,
      };
    }

    // 각 댓글의 userId로 User 정보 조회
    const userIds = [...new Set(commentsResult.data.map((comment) => comment.userId))];
    const usersResult = await supabase.from(DATABASE_TABLE.USER).select('*').in('id', userIds);

    if (usersResult.error) {
      return {
        success: false,
        data: null,
        message: usersResult.error.message || '사용자 정보를 불러오는데 실패했습니다',
      };
    }

    // 댓글과 사용자 정보 결합
    const commentsWithUser: BoardCommentWithUser[] = commentsResult.data.map((comment) => {
      const user = usersResult.data?.find((u) => u.id === comment.userId) || null;
      return {
        ...comment,
        user: user as UserModel | null,
      };
    });

    return {
      success: true,
      data: commentsWithUser,
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다',
    };
  }
};

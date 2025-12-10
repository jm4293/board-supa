'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';

export const deleteBoardCommentAction = async (commentId: number): Promise<ResponseType<null>> => {
  try {
    const supabase = await createClient();
    const result = await supabase.from(DATABASE_TABLE.BOARD_COMMENT).delete().eq('id', commentId);

    if (result.error) {
      return {
        success: false,
        data: null,
        message: result.error.message || '댓글 삭제에 실패했습니다',
      };
    }

    return {
      success: true,
      data: null,
      message: '댓글 삭제에 성공했습니다',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '댓글 삭제에 실패했습니다',
    };
  }
};

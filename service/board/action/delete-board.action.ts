'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { authUtil } from '@/share/utils/auth';

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
    const boardResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .select('*')
      .eq('id', boardId)
      .eq('is_deleted', 0)
      .single();

    if (!boardResponse.data) {
      return {
        success: false,
        data: null,
        message: '게시글을 찾을 수 없습니다',
      };
    }

    /*     // UserAccount 조회
    const userAccountResponse = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .select('id')
      .eq('email', session.email)
      .single();

    if (!userAccountResponse.data) {
      return {
        success: false,
        data: null,
        message: '사용자 정보를 찾을 수 없습니다',
      };
    }

    // 작성자 확인
    if (boardResponse.data.user_account_id !== userAccountResponse.data.id) {
      return {
        success: false,
        data: null,
        message: '게시글을 삭제할 권한이 없습니다',
      };
    }

    const deleteResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .update({
        is_deleted: 1,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', boardId);

    if (deleteResponse.error) {
      return {
        success: false,
        data: null,
        message: '게시글 삭제에 실패했습니다',
      };
    } */

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

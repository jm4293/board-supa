'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { getSession } from '@/share/utils/auth';

import { BoardModel } from '../model';

export interface CreateBoardActionParams {
  title: string;
  content: string;
}

export const createBoardAction = async (formData: FormData): Promise<ResponseType<BoardModel>> => {
  try {
    const session = await getSession();

    if (!session) {
      redirect('/auth/login');
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

    // UserAccount 조회
    const userAccountResponse = await supabase
      .from(DATABASE_TABLE.USER_ACCOUNT)
      .select('id')
      .eq('userId', session.id)
      .single();

    if (!userAccountResponse.data) {
      return {
        success: false,
        data: null,
        message: '사용자 정보를 찾을 수 없습니다',
      };
    }

    // Board 생성
    const boardResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .insert({
        userAccountId: userAccountResponse.data.id,
        title: title.trim(),
        content: content.trim(),
        viewCount: 0,
        isDeleted: 0,
      })
      .select('*')
      .single<BoardModel>();

    if (!boardResponse.data) {
      return {
        success: false,
        data: null,
        message: '게시글 작성에 실패했습니다',
      };
    }

    redirect(`/board/${boardResponse.data.id}`);
  } catch (error) {
    // redirect()는 NEXT_REDIRECT 에러를 throw하는데, 이것은 정상 동작이므로 다시 throw
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
      message: error instanceof Error ? error.message : '게시글 작성에 실패했습니다',
    };
  }
};

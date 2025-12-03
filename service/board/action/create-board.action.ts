'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type/response.type';
import { JwtPayload, authUtil } from '@/share/utils';
import { jwtUtil } from '@/share/utils/jwt';

import { BoardModel } from '../model';

export interface CreateBoardActionParams {
  title: string;
  content: string;
  image?: string | null;
}

export const createBoardAction = async (params: CreateBoardActionParams): Promise<ResponseType<{ id: number }>> => {
  try {
    const { title, content, image } = params;

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

    const session = await authUtil.getSession();
    if (!session) {
      return {
        success: false,
        data: null,
        message: '로그인이 필요합니다',
      };
    }

    const decoded = jwtUtil.decode(session) as JwtPayload | null;
    if (!decoded || !decoded.userAccountId) {
      return {
        success: false,
        data: null,
        message: '유효하지 않은 세션입니다',
      };
    }

    // Board 생성
    const boardResponse = await supabase
      .from(DATABASE_TABLE.BOARD)
      .insert({
        userAccountId: decoded.userAccountId,
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

    // 이미지가 있으면 BoardImage 테이블에 저장
    if (image) {
      // image는 이미 전체 URL이므로 그대로 사용
      const imageName = image.split('/').pop() || null;

      await supabase.from(DATABASE_TABLE.BOARD_IMAGE).insert({
        boardId: boardResponse.data.id,
        imageUrl: image,
        imageName,
        imageSize: null,
        mimeType: null,
        orderNum: 1,
      });
    }

    return {
      success: true,
      data: { id: boardResponse.data.id },
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '게시글 작성에 실패했습니다',
    };
  }
};

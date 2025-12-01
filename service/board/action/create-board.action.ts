'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { jwtUtil } from '@/share/utils';

export interface CreateBoardActionParams {
  title: string;
  content: string;
  image: string | null;
}

export const createBoardAction = async (params: CreateBoardActionParams) => {
  const { title, content, image } = params;

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get('SESSION')?.value;

  if (!sessionToken) {
    return {
      success: false,
      data: null,
      message: '로그인 후 이용해주세요.',
    };
  }

  const { userAccountId } = jwtUtil.verify(sessionToken!);

  const supabase = await createClient();

  const newBoard = await supabase
    .from(DATABASE_TABLE.BOARD)
    .insert({
      userAccountId: userAccountId,
      title,
      content,
    })
    .select('*')
    .single();

  if (newBoard.error) {
    return {
      success: false,
      data: null,
      message: newBoard.error.message,
    };
  }

  if (image) {
    const newBoardImage = await supabase
      .from(DATABASE_TABLE.BOARD_IMAGE)
      .insert({
        boardId: newBoard.data?.id,
        imageUrl: image,
        imageName: null,
        imageSize: null,
        mimeType: null,
        orderNum: null,
      })
      .select('*')
      .single();

    if (newBoardImage.error) {
      return {
        success: false,
        data: null,
        message: newBoardImage.error.message,
      };
    }
  }

  return {
    success: true,
    data: newBoard.data,
    message: null,
  };
};

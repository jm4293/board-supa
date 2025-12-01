'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type';

export interface ModifyBoardActionParams {
  id: number;
  title: string;
  content: string;
  image: string | null;
}

export const modifyBoardAction = async (params: ModifyBoardActionParams): Promise<ResponseType<void>> => {
  const { id, title, content, image } = params;

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get('SESSION')?.value;

  if (!sessionToken) {
    return {
      success: false,
      data: null,
      message: '로그인 후 이용해주세요.',
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DATABASE_TABLE.BOARD)
    .update({ title, content })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }

  if (image) {
    const { data, error } = await supabase
      .from(DATABASE_TABLE.BOARD_IMAGE)
      .update({ imageUrl: image })
      .eq('boardId', id)
      .select()
      .single();
  }

  return {
    success: true,
    data: data,
    message: null,
  };
};

'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type';

import { BoardModel } from '../model';

export const getBoardDetailAction = async ({ id }: { id: string }): Promise<ResponseType<BoardModel>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DATABASE_TABLE.BOARD)
    .select(
      `
    *,
    boardImage:BoardImage(
      *
    ),
    userAccount:UserAccount(
      *,
      user:User(
        *
      )
    )
  `,
    )
    .eq('id', id)
    .single();

  if (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }

  return {
    success: true,
    data: data,
    message: null,
  };
};

'use server';

import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';
import { ResponseType } from '@/share/type';

export const deleteBoardAction = async ({ id }: { id: number }): Promise<ResponseType<void>> => {
  const supabase = await createClient();

  const { data, error } = await supabase.from(DATABASE_TABLE.BOARD).delete().eq('id', id);

  if (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }

  return {
    success: true,
    data: null,
    message: null,
  };
};

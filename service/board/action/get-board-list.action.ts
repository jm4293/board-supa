import { createClient } from '@/config/supabase/server';

import { DATABASE_TABLE } from '@/share/const';

export const getBoardListAction = async ({ page }: { page: number }) => {
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
    .eq('isDeleted', 0)
    .order('createdAt', { ascending: false })
    .range(page * 10, (page + 1) * 10 - 1);

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

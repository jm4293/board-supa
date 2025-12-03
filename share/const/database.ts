export const DATABASE_TABLE = {
  USER: 'User',
  USER_ACCOUNT: 'UserAccount',
  BOARD: 'Board',
  BOARD_COMMENT: 'BoardComment',
  BOARD_IMAGE: 'BoardImage',
};

export const IMAGE_STORAGE_PATH = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`
  : '';

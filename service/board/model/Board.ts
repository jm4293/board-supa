import { UserAccountModel } from '@/service/user';

import { BoardImageModel } from '.';

export interface BoardModel {
  id: number;
  userAccountId: number;
  title: string;
  content: string;
  viewCount: number | null;
  isDeleted: number | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  boardImage: BoardImageModel[];
  userAccount: UserAccountModel;
}

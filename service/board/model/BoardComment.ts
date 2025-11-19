export interface BoardCommentModel {
  id: number;
  boardId: number;
  userId: number;
  parentId: number | null;
  content: string;
  isDeleted: number | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface BoardModel {
  id: number;
  userId: number;
  title: string;
  content: string;
  viewCount: number | null;
  isDeleted: number | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

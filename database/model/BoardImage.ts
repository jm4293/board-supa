export interface BoardImageModel {
  id: number;
  boardId: number;
  imageUrl: string;
  imageName: string | null;
  imageSize: number | null;
  mimeType: string | null;
  orderNum: number | null;
  createdAt: Date | null;
}

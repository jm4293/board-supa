export interface UserModel {
  id: number;
  username: string;
  nickname: string;
  profileImage: string | null;
  status: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

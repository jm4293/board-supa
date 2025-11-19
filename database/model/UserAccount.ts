export interface UserAccountModel {
  id: number;
  userId: number;
  email: string | null;
  password: string | null;
  provider: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

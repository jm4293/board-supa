export interface ResponseType<T = undefined> {
  success: boolean;
  data: T | null;
  message: string | null;
}

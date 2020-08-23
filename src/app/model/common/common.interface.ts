export interface Res<T> {
  success: boolean;
  data: T;
  message?: string;
}

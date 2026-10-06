export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  meta: unknown;
  data: T;
}

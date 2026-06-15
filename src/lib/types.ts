export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export type ErrorWithMessage = {
  message?: string;
  error?: string;
};

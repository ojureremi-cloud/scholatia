import type { ApiErrorResponse, ApiSuccessResponse, AuthErrorCode } from '@/types/auth';

export function jsonSuccess<T>(data: T, status = 200): Response {
  const body: ApiSuccessResponse<T> = { data };
  return Response.json(body, { status });
}

export function jsonError(
  status: number,
  code: AuthErrorCode,
  message: string,
  fieldErrors?: Record<string, string>,
): Response {
  const body: ApiErrorResponse = {
    error: {
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };
  return Response.json(body, { status });
}

export async function readJsonBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

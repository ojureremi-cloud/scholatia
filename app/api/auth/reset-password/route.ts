import type { NextRequest } from 'next/server';
import type { ResetPasswordRequest } from '@/types/auth';
import { AuthServiceError, requestPasswordReset, resetPassword } from '@/lib/auth/service';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/auth/response';
import { validatePasswordResetRequest } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<ResetPasswordRequest>(request);
    const validation = validatePasswordResetRequest(body);
    if (!validation.ok) {
      return jsonError(400, 'invalid_input', 'Please check the submitted fields.', validation.errors);
    }

    if (validation.value.email) {
      const result = await requestPasswordReset(validation.value.email);
      return jsonSuccess(result);
    }

    const user = await resetPassword(validation.value.token as string, validation.value.newPassword as string);
    return jsonSuccess({ reset: true, user });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      const status = error.code === 'expired_token' ? 410 : 400;
      return jsonError(status, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

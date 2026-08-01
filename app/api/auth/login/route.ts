import type { NextRequest } from 'next/server';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { AuthServiceError, authenticateUser, createUserSession, getPublicUser, toPublicSession } from '@/lib/auth/service';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/auth/response';
import { setSessionCookie } from '@/lib/auth/session';
import { validateLoginRequest } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<LoginRequest>(request);
    const validation = validateLoginRequest(body);
    if (!validation.ok) {
      return jsonError(400, 'invalid_input', 'Please check the submitted fields.', validation.errors);
    }

    const user = await authenticateUser(validation.value.email, validation.value.password);
    const { token, session } = await createUserSession(user, validation.value.rememberMe ?? false, request);
    await setSessionCookie(token, session.rememberMe);

    const response: LoginResponse = {
      user: getPublicUser(user.id) as LoginResponse['user'],
      session: toPublicSession(session),
    };
    return jsonSuccess(response);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      const status = error.code === 'email_not_verified' ? 403 : 401;
      return jsonError(status, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

import type { NextRequest } from 'next/server';
import type { VerifyEmailRequest } from '@/types/auth';
import { AuthServiceError, verifyEmail } from '@/lib/auth/service';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/auth/response';

async function handleVerify(token: string, email?: string) {
  const user = await verifyEmail(token, email);
  return jsonSuccess({ verified: true, user });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email') ?? undefined;
  if (!token) {
    return jsonError(400, 'invalid_input', 'Missing verification token.');
  }
  try {
    return await handleVerify(token, email);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      const status = error.code === 'expired_token' ? 410 : 400;
      return jsonError(status, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<VerifyEmailRequest>(request);
    if (!body.token) {
      return jsonError(400, 'invalid_input', 'Missing verification token.');
    }
    return await handleVerify(body.token, body.email);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      const status = error.code === 'expired_token' ? 410 : 400;
      return jsonError(status, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

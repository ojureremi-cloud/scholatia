import type { NextRequest } from 'next/server';
import type { RegisterRequest } from '@/types/auth';
import { AuthServiceError, registerUser } from '@/lib/auth/service';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/auth/response';
import { validateRegisterRequest } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<RegisterRequest>(request);
    const validation = validateRegisterRequest(body);
    if (!validation.ok) {
      return jsonError(400, 'invalid_input', 'Please check the submitted fields.', validation.errors);
    }

    const result = await registerUser(validation.value);
    return jsonSuccess(result, 201);
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return jsonError(409, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

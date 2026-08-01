import type { NextRequest } from 'next/server';
import type { SessionResponse } from '@/types/auth';
import { getPublicUser, getRequestSession, toPublicSession } from '@/lib/auth/service';
import * as store from '@/lib/auth/store';
import { jsonSuccess } from '@/lib/auth/response';

export async function GET(request: NextRequest) {
  const current = await getRequestSession(request);
  if (!current) {
    const response: SessionResponse = { authenticated: false };
    return jsonSuccess(response);
  }

  const activeSessions = store.listSessionsForUser(current.user.id).map(toPublicSession);
  const response: SessionResponse = {
    authenticated: true,
    user: getPublicUser(current.user.id),
    session: toPublicSession(current.session),
    activeSessions,
  };
  return jsonSuccess(response);
}

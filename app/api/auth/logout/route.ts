import { NextResponse, type NextRequest } from 'next/server';
import { revokeRequestSession } from '@/lib/auth/service';
import { deleteSessionCookie } from '@/lib/auth/session';
import { jsonSuccess } from '@/lib/auth/response';

async function revoke(request: NextRequest): Promise<void> {
  await revokeRequestSession(request);
  await deleteSessionCookie();
}

export async function POST(request: NextRequest) {
  await revoke(request);
  return jsonSuccess({ ok: true });
}

export async function GET(request: NextRequest) {
  await revoke(request);
  return NextResponse.redirect(new URL('/login', request.url));
}

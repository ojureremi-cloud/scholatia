import type { NextRequest } from 'next/server';
import type { UpdateProfileRequest } from '@/types/auth';
import type { ProfilePrivacy } from '@/types/identity';
import type { ProfileRow } from '@/types/schema';
import { can } from '@/lib/rbac';
import { AuthServiceError, getPublicUser, getRequestSession, toPublicProfile } from '@/lib/auth/service';
import * as store from '@/lib/auth/store';
import { jsonError, jsonSuccess, readJsonBody } from '@/lib/auth/response';

const PROFILE_PRIVACY_OPTIONS: ProfilePrivacy[] = ['Public', 'Institution Only', 'Connections', 'Private', 'Custom'];

export async function GET(request: NextRequest) {
  const current = await getRequestSession(request);
  if (!current) {
    return jsonError(401, 'unauthorized', 'You must be signed in to access your profile.');
  }

  const profile = store.findProfileByUserId(current.user.id);
  const said = store.findSaidByUserId(current.user.id)?.said ?? null;

  return jsonSuccess({
    user: getPublicUser(current.user.id),
    profile: profile ? toPublicProfile(profile) : null,
    said,
  });
}

export async function PATCH(request: NextRequest) {
  const current = await getRequestSession(request);
  if (!current) {
    return jsonError(401, 'unauthorized', 'You must be signed in to edit your profile.');
  }

  const authorized = can({
    roles: current.user.roles,
    verificationLevel: current.user.verificationLevel,
    permission: 'write:profile',
  });
  if (!authorized) {
    return jsonError(403, 'unauthorized', 'You do not have permission to edit this profile.');
  }

  try {
    const body = await readJsonBody<UpdateProfileRequest>(request);
    const errors: Record<string, string> = {};

    if (body.fullName !== undefined && body.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }
    if (body.privacy !== undefined && !PROFILE_PRIVACY_OPTIONS.includes(body.privacy as ProfilePrivacy)) {
      errors.privacy = 'Please choose a valid privacy setting.';
    }
    if (Object.keys(errors).length > 0) {
      return jsonError(400, 'invalid_input', 'Please check the submitted fields.', errors);
    }

    const patch: Partial<ProfileRow> = {};
    if (body.fullName !== undefined) patch.fullName = body.fullName.trim();
    if (body.institution !== undefined) patch.institution = body.institution.trim() || undefined;
    if (body.department !== undefined) patch.department = body.department.trim() || undefined;
    if (body.country !== undefined) patch.country = body.country.trim() || undefined;
    if (body.avatarUrl !== undefined) patch.avatarUrl = body.avatarUrl.trim() || undefined;
    if (body.biography !== undefined) patch.biography = body.biography.trim() || undefined;
    if (body.privacy !== undefined) patch.privacy = body.privacy as ProfilePrivacy;

    const updated = store.updateProfile(current.user.id, patch);
    if (!updated) {
      return jsonError(500, 'internal_error', 'Unable to update the profile.');
    }

    return jsonSuccess({ profile: toPublicProfile(updated) });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      return jsonError(400, error.code, error.message);
    }
    return jsonError(500, 'internal_error', 'Something went wrong.');
  }
}

'use client';

import { useMemo } from 'react';
import { PermissionGuard, PermissionMatrix } from '@/lib/auth';
import type { AuthUser, PermissionKey } from '@/types/security';

export default function usePermissions(user: AuthUser | null) {
  const permissions = useMemo(() => (user ? PermissionMatrix.forUser(user) : []), [user]);

  const can = useMemo(
    () => (permission: PermissionKey) => {
      if (!user) {
        return false;
      }

      return PermissionGuard.can({ user, permission });
    },
    [user],
  );

  return useMemo(() => ({ permissions, can }), [can, permissions]);
}

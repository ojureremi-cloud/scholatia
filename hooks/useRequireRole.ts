'use client';

import { useMemo } from 'react';
import type { AuthUser, PermissionKey } from '@/types/security';
import type { RoleType } from '@/types/identity';

export default function useRequireRole(user: AuthUser | null, requiredRole: RoleType, permission?: PermissionKey) {
  const canAccess = useMemo(() => {
    if (!user) {
      return false;
    }

    const hasRole = user.roles.includes(requiredRole);
    if (!hasRole) {
      return false;
    }

    if (!permission) {
      return true;
    }

    return user.roles.includes(requiredRole);
  }, [permission, requiredRole, user]);

  return useMemo(() => ({ canAccess }), [canAccess]);
}

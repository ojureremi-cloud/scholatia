'use client';

import { useMemo } from 'react';
import { VerificationLevel } from '@/types/identity';

export default function useVerification(level?: VerificationLevel | null) {
  return useMemo(
    () => ({
      verificationLevel: level ?? VerificationLevel.Unverified,
      isVerified: Boolean(level && level >= VerificationLevel.EmailVerified),
    }),
    [level],
  );
}

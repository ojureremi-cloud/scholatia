'use client';

import { useMemo } from 'react';
import type { InstitutionProfile } from '@/types/identity';

export default function useInstitutionVerification(institution?: InstitutionProfile | null) {
  return useMemo(() => ({
    verificationStatus: institution?.verificationStatus ?? 'Pending',
    verificationHistory: institution?.verificationHistory ?? [],
    hasVerifiedRecord: Boolean((institution?.verificationHistory ?? []).length > 0),
  }), [institution]);
}

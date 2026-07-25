'use client';

import { useMemo, useState } from 'react';
import { createInstitutionProfile } from '@/lib/institutions';
import type { InstitutionProfile } from '@/types/identity';

export default function useInstitution(initialInstitution?: InstitutionProfile | null) {
  const [institution, setInstitution] = useState<InstitutionProfile | null>(initialInstitution ?? createInstitutionProfile());

  return useMemo(
    () => ({
      institution,
      setInstitution,
      isLoaded: Boolean(institution),
    }),
    [institution],
  );
}

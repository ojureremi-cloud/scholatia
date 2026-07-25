'use client';

import { useMemo } from 'react';
import type { InstitutionAffiliation } from '@/types/identity';

export default function useAffiliations(initialAffiliations: InstitutionAffiliation[] = []) {
  return useMemo(() => ({
    affiliations: initialAffiliations,
    currentAffiliations: initialAffiliations.filter((affiliation) => affiliation.current),
    previousAffiliations: initialAffiliations.filter((affiliation) => affiliation.previous),
  }), [initialAffiliations]);
}

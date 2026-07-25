'use client';

import { useMemo } from 'react';
import type { InstitutionProfile } from '@/types/identity';

export default function useInstitutionSearch(institutions: InstitutionProfile[] = []) {
  return useMemo(() => ({
    institutions,
    search: (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return institutions;
      }

      return institutions.filter((institution) => [
        institution.institutionName,
        institution.country,
        institution.city,
        institution.institutionType,
        institution.accreditation,
        institution.verificationStatus,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery)));
    },
  }), [institutions]);
}

'use client';

import { useMemo } from 'react';
import { createResearchProfile } from '@/lib/said';
import type { SAIDProfile } from '@/types/identity';

export default function useResearchProfile(profile?: SAIDProfile | null) {
  return useMemo(() => ({
    profile: profile ?? createResearchProfile(),
    researchInterests: profile?.researchInterests ?? [],
    publicationSummary: profile?.publicationSummary ?? { totalArticles: 0, totalCitations: 0 },
  }), [profile]);
}

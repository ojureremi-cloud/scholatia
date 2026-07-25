'use client';

import { useMemo, useState } from 'react';
import { createResearchProfile } from '@/lib/said';
import type { SAIDProfile } from '@/types/identity';

export default function useProfile(initialProfile?: SAIDProfile | null) {
  const [profile, setProfile] = useState<SAIDProfile | null>(initialProfile ?? createResearchProfile());

  return useMemo(
    () => ({
      profile,
      setProfile,
      isLoaded: Boolean(profile),
    }),
    [profile],
  );
}

'use client';

import { useMemo, useState } from 'react';
import { createConferenceProfile } from '@/lib/conferences';
import type { ConferenceProfile } from '@/types/identity';

export default function useConference(initialConference?: ConferenceProfile | null) {
  const [conference, setConference] = useState<ConferenceProfile | null>(initialConference ?? createConferenceProfile());

  return useMemo(() => ({
    conference,
    setConference,
    isLoaded: Boolean(conference),
  }), [conference]);
}

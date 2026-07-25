'use client';

import { useMemo } from 'react';
import type { ConferenceProfile, ConferenceRegistrationOption } from '@/types/identity';

export default function useConferenceRegistration(conference?: ConferenceProfile | null) {
  return useMemo(() => ({
    registrations: conference?.registrations ?? [],
    getRegistration: (audience: ConferenceRegistrationOption['audience']) => conference?.registrations.find((option) => option.audience === audience),
  }), [conference]);
}

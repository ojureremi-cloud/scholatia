'use client';

import { useMemo } from 'react';
import type { ConferenceProfile, ConferenceCommitteeMember } from '@/types/identity';

export default function useConferenceCommittee(conference?: ConferenceProfile | null) {
  return useMemo(() => ({
    committee: conference?.committee ?? [],
    getByRole: (role: ConferenceCommitteeMember['role']) => conference?.committee.filter((member) => member.role === role) ?? [],
  }), [conference]);
}

'use client';

import { useMemo } from 'react';
import type { ConferenceProfile, ConferenceSubmissionOption } from '@/types/identity';

export default function useConferenceSubmissions(conference?: ConferenceProfile | null) {
  return useMemo(() => ({
    submissions: conference?.submissions ?? [],
    getSubmission: (type: ConferenceSubmissionOption['type']) => conference?.submissions.find((option) => option.type === type),
  }), [conference]);
}

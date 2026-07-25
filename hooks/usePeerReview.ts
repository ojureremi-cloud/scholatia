'use client';

import { useMemo } from 'react';
import type { JournalProfile } from '@/types/identity';

export default function usePeerReview(journal?: JournalProfile | null) {
  return useMemo(() => ({
    peerReviewModes: journal?.peerReviewModes ?? [],
    workflow: journal?.workflow ?? [],
  }), [journal]);
}

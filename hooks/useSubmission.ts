'use client';

import { useMemo } from 'react';
import type { JournalProfile, JournalSubmissionType } from '@/types/identity';

export default function useSubmission(journal?: JournalProfile | null) {
  return useMemo(() => ({
    submissionTypes: journal?.submissionTypes ?? [],
    getSubmissionType: (type: JournalSubmissionType) => journal?.submissionTypes.includes(type),
  }), [journal]);
}

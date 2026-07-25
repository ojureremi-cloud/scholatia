'use client';

import { useMemo } from 'react';
import type { JournalProfile } from '@/types/identity';

export default function useJournalSearch(journals: JournalProfile[] = []) {
  return useMemo(() => ({
    journals,
    search: (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return journals;
      }

      return journals.filter((journal) => [
        journal.journalTitle,
        journal.issn,
        journal.eissn,
        journal.publisher,
        journal.institution,
        journal.country,
        journal.language,
        journal.discipline,
        journal.researchAreas.join(' '),
        journal.reviewModel,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery)));
    },
  }), [journals]);
}

'use client';

import { useMemo } from 'react';
import type { ConferenceProfile } from '@/types/identity';

export default function useConferenceSearch(conferences: ConferenceProfile[] = []) {
  return useMemo(() => ({
    conferences,
    search: (query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) {
        return conferences;
      }

      return conferences.filter((conference) => [
        conference.title,
        conference.theme,
        conference.country,
        conference.institution,
        conference.eventType,
        conference.language,
        conference.city,
        conference.researchAreas.join(' '),
        conference.keywords.join(' '),
      ].some((value) => value?.toLowerCase().includes(normalizedQuery)));
    },
  }), [conferences]);
}

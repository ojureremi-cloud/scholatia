'use client';

import { useMemo } from 'react';
import type { ConferenceRecord, ConferenceSession } from '@/types/conference';

export default function useConferenceSchedule(conference?: ConferenceRecord | null) {
  return useMemo(() => ({
    sessions: conference?.sessions ?? [],
    papers: conference?.acceptedPapers ?? [],
    getSession: (id: string) => conference?.sessions.find((session) => session.id === id),
    getSessionsByDate: (date: string) =>
      (conference?.sessions ?? []).filter((session: ConferenceSession) => session.date === date),
    getSessionsByType: (type: ConferenceSession['type']) =>
      (conference?.sessions ?? []).filter((session) => session.type === type),
  }), [conference]);
}

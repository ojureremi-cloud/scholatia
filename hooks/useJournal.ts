'use client';

import { useMemo, useState } from 'react';
import { createJournalProfile } from '@/lib/journals';
import type { JournalProfile } from '@/types/identity';

export default function useJournal(initialJournal?: JournalProfile | null) {
  const [journal, setJournal] = useState<JournalProfile | null>(initialJournal ?? createJournalProfile());

  return useMemo(() => ({
    journal,
    setJournal,
    isLoaded: Boolean(journal),
  }), [journal]);
}

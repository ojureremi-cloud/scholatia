'use client';

import { useMemo } from 'react';
import type { JournalProfile } from '@/types/identity';

export default function useEditorialBoard(journal?: JournalProfile | null) {
  return useMemo(() => ({
    editorialStructure: journal?.editorialStructure ?? [],
    editors: journal?.editors ?? [],
    reviewBoard: journal?.reviewBoard ?? [],
    productionTeam: journal?.productionTeam ?? [],
    publishingStaff: journal?.publishingStaff ?? [],
  }), [journal]);
}

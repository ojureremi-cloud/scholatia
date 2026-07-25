'use client';

import { useMemo } from 'react';
import type { TrustMetrics } from '@/types/identity';

export default function useTrustScore(metrics?: TrustMetrics | null) {
  return useMemo(() => {
    const fallbackScore = metrics?.trustScore ?? 70;
    return {
      trustScore: fallbackScore,
      status: fallbackScore >= 90 ? 'Trusted Scholar' : fallbackScore >= 75 ? 'Verified Expert' : 'Verified Member',
    };
  }, [metrics]);
}

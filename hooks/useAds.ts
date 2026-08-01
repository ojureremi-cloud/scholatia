'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  activateCampaign,
  calculateBudgetUtilization,
  pauseCampaign,
  remainingBudget,
  resumeCampaign,
  stopCampaign,
} from '@/lib/ads';
import { ADVERTISING_PORTFOLIO } from '@/constants/placeholder-ads';
import type { AdCampaign, AdCampaignStatus, AdSet } from '@/types/ads';

export default function useAds() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(ADVERTISING_PORTFOLIO.campaigns);
  const [adSets, setAdSets] = useState<AdSet[]>(ADVERTISING_PORTFOLIO.adSets);

  const applyStatus = useCallback(
    (campaignId: string, action: (campaign: AdCampaign, adSets: readonly AdSet[]) => { campaign: AdCampaign; adSets: AdSet[] }) => {
      const campaign = campaigns.find((entry) => entry.id === campaignId);
      if (!campaign) return;
      const next = action(campaign, adSets);
      setCampaigns((current) => current.map((entry) => (entry.id === campaignId ? next.campaign : entry)));
      setAdSets((current) =>
        current.map((entry) => next.adSets.find((set) => set.id === entry.id) ?? entry),
      );
    },
    [campaigns, adSets],
  );

  const activate = useCallback(
    (campaignId: string) => applyStatus(campaignId, activateCampaign),
    [applyStatus],
  );
  const pause = useCallback(
    (campaignId: string) => applyStatus(campaignId, pauseCampaign),
    [applyStatus],
  );
  const resume = useCallback(
    (campaignId: string) => applyStatus(campaignId, resumeCampaign),
    [applyStatus],
  );
  const stop = useCallback(
    (campaignId: string) => applyStatus(campaignId, stopCampaign),
    [applyStatus],
  );

  const adSetsByCampaign = useMemo(() => {
    const map = new Map<string, AdSet[]>();
    for (const set of adSets) {
      const sets = map.get(set.campaignId) ?? [];
      sets.push(set);
      map.set(set.campaignId, sets);
    }
    return map;
  }, [adSets]);

  const campaignStatus = useCallback(
    (campaignId: string): AdCampaignStatus => {
      return campaigns.find((campaign) => campaign.id === campaignId)?.status ?? 'draft';
    },
    [campaigns],
  );

  return useMemo(
    () => ({
      portfolio: ADVERTISING_PORTFOLIO,
      campaigns,
      adSets,
      adSetsByCampaign,
      activate,
      pause,
      resume,
      stop,
      campaignStatus,
      setCampaignStatus: (campaignId: string, status: AdCampaignStatus) => {
        setCampaigns((current) =>
          current.map((campaign) => (campaign.id === campaignId ? { ...campaign, status } : campaign)),
        );
      },
      budgetOf: (set: AdSet) => ({
        utilization: calculateBudgetUtilization(set.budget),
        remaining: remainingBudget(set.budget),
      }),
    }),
    [campaigns, adSets, adSetsByCampaign, activate, pause, resume, stop, campaignStatus],
  );
}

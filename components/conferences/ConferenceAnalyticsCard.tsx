'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { ConferenceAnalytics } from '@/types/conference';

type ConferenceAnalyticsCardProps = {
  analytics: ConferenceAnalytics;
  className?: string;
};

export default function ConferenceAnalyticsCard({ analytics, className = '' }: ConferenceAnalyticsCardProps) {
  const stats = [
    { label: 'Submissions', value: `${analytics.totalSubmissions}` },
    { label: 'Accepted', value: `${analytics.totalAccepted}` },
    { label: 'Acceptance rate', value: `${analytics.acceptanceRate}%` },
    { label: 'Attendees', value: `${analytics.totalAttendees}` },
    { label: 'Registered', value: `${analytics.registeredAttendees}` },
    { label: 'Countries', value: `${analytics.countriesRepresented}` },
    { label: 'Keynotes', value: `${analytics.keynoteCount}` },
    { label: 'Papers', value: `${analytics.paperCount}` },
    { label: 'Workshops', value: `${analytics.workshopCount}` },
    { label: 'Tutorials', value: `${analytics.tutorialCount}` },
    { label: 'Demos', value: `${analytics.demoCount}` },
    { label: 'Sponsors', value: `${analytics.totalSponsors}` },
    { label: 'Travel grants', value: `${analytics.travelGrantsAwarded}` },
    { label: 'Awards', value: `${analytics.bestPaperAwards}` },
  ];

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
      {analytics.participantSatisfaction !== undefined ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 p-4">
          <span className="text-sm font-medium text-slate-700">
            Participant satisfaction {analytics.participantSatisfaction}/5
          </span>
          <Badge variant="success">Verified analytics</Badge>
        </div>
      ) : null}
    </div>
  );
}

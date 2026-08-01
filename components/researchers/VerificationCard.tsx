'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

const stepStyles: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  'not-started': 'bg-slate-100 text-slate-600',
};

type VerificationCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function VerificationCard({ researcher, className = '' }: VerificationCardProps) {
  const { verification } = researcher;
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Identity verification</h3>
        <Badge variant={verification.verified ? 'success' : 'warning'}>{verification.verificationStatus}</Badge>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{verification.identityScore}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Identity score</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{verification.trustScore}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Trust score</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-3xl font-semibold text-slate-900">{verification.visibilityScore}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Visibility score</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {verification.verificationSteps.map((step) => (
          <li key={step.label} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{step.label}</p>
              {step.detail ? <p className="text-xs text-slate-500">{step.detail}</p> : null}
            </div>
            <span className={['rounded-full px-2 py-0.5 text-xs font-medium', stepStyles[step.status] ?? 'bg-slate-100 text-slate-600'].join(' ')}>
              {step.status}
            </span>
          </li>
        ))}
      </ul>
      {verification.academicAchievements.length > 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium text-slate-900">Academic achievements: </span>
          {verification.academicAchievements.join(' • ')}
        </p>
      ) : null}
      {verification.lastVerified ? (
        <p className="mt-3 text-xs text-slate-500">Last verified: {verification.lastVerified}</p>
      ) : null}
    </section>
  );
}

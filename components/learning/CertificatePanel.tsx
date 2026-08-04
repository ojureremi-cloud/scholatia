'use client';

import { CredentialKindBadge, CredentialStatusBadge } from './Badges';
import { LearningEmptyState } from './LearningEmptyState';
import { formatDate, formatNumber } from './format';
import useLearning from '@/hooks/useLearning';

export function CertificatePanel() {
  const { passport } = useLearning();
  const certificates = passport.certificates;

  if (certificates.length === 0) {
    return (
      <LearningEmptyState
        title="No certificates yet"
        description="Certificates of completion will appear here as you finish courses."
      />
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Certificates ({formatNumber(certificates.length)})
      </h2>
      <ul className="mt-5 space-y-4">
        {certificates.map((certificate) => (
          <li
            key={certificate.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span aria-hidden="true" className="text-xl">
                🏅
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{certificate.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Issued by {certificate.issuerName} on {formatDate(certificate.issuedAt)}
                </p>
                <p className="mt-1 break-all text-xs text-slate-400">Ref: {certificate.verificationReference}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <CredentialKindBadge kind={certificate.kind} />
              <CredentialStatusBadge status={certificate.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

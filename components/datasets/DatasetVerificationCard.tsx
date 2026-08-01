import React from 'react';
import Badge from '@/components/ui/Badge';
import type { Dataset, DatasetVerificationStatus } from '@/types/dataset';
import { formatDate } from './format';

const verificationDescriptions: Record<DatasetVerificationStatus, string> = {
  verified: 'The dataset has passed automated and manual integrity checks, including schema validation and checksum verification.',
  'peer-reviewed': 'The dataset has been reviewed by independent experts as part of a data paper or repository review.',
  'in-review': 'The dataset is currently undergoing verification and peer review.',
  unverified: 'The dataset has not yet completed verification checks.',
};

const verificationVariant: Record<DatasetVerificationStatus, 'success' | 'info' | 'warning'> = {
  verified: 'success',
  'peer-reviewed': 'success',
  'in-review': 'info',
  unverified: 'warning',
};

const verificationChecks: Record<DatasetVerificationStatus, string[]> = {
  verified: ['File integrity', 'Schema validation', 'Metadata completeness', 'DOI registration'],
  'peer-reviewed': ['File integrity', 'Expert data review', 'Documentation review'],
  'in-review': ['File integrity', 'Schema validation'],
  unverified: [],
};

type DatasetVerificationCardProps = {
  dataset: Dataset;
};

export function DatasetVerificationCard({ dataset }: DatasetVerificationCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={verificationVariant[dataset.verification]}>{dataset.verification}</Badge>
        {dataset.verifiedAt ? (
          <span className="text-sm text-slate-600">Verified on {formatDate(dataset.verifiedAt)}</span>
        ) : null}
      </div>
      <p className="text-sm leading-6 text-slate-700">{verificationDescriptions[dataset.verification]}</p>
      {verificationChecks[dataset.verification].length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {verificationChecks[dataset.verification].map((check) => (
            <li
              key={check}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span aria-hidden="true" className="text-emerald-600">
                ✓
              </span>
              {check}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
          Verification checks will be scheduled once the dataset is ready for publication.
        </p>
      )}
    </div>
  );
}

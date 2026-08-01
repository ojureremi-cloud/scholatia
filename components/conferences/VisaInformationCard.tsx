'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { VisaInformation } from '@/types/conference';

type VisaInformationCardProps = {
  visa: VisaInformation;
  className?: string;
};

export default function VisaInformationCard({ visa, className = '' }: VisaInformationCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white p-4 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Visa information for {visa.country}</p>
        {visa.invitationLetterAvailable ? (
          <Badge variant="success">Invitation letter available</Badge>
        ) : (
          <Badge variant="default">No invitation letter</Badge>
        )}
      </div>
      {visa.processingTimeDays !== undefined ? (
        <p className="mt-2 text-sm text-slate-600">
          Typical processing time: {visa.processingTimeDays} days
        </p>
      ) : null}
      {visa.requirements && visa.requirements.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {visa.requirements.map((requirement) => (
            <li key={requirement} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-700" />
              {requirement}
            </li>
          ))}
        </ul>
      ) : null}
      {visa.supportContact ? (
        <p className="mt-3 text-xs text-slate-500">Support contact: {visa.supportContact}</p>
      ) : null}
    </div>
  );
}

'use client';

import React from 'react';
import type { InstitutionContact } from '@/types/institution';

type InstitutionContactCardProps = {
  contacts: InstitutionContact[];
  className?: string;
};

export default function InstitutionContactCard({ contacts, className = '' }: InstitutionContactCardProps) {
  return (
    <ul className={['space-y-3', className].filter(Boolean).join(' ')}>
      {contacts.map((contact) => (
        <li key={contact.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-medium text-slate-900">{contact.label}</p>
            <p className="mt-0.5 break-all text-sm text-slate-600">{contact.value}</p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {contact.type}
            {contact.primary ? ' · Primary' : ''}
          </span>
        </li>
      ))}
    </ul>
  );
}

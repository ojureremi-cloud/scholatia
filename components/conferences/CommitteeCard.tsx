'use client';

import React from 'react';
import type { ConferenceCommitteeMember } from '@/types/identity';

type CommitteeCardProps = {
  member: ConferenceCommitteeMember;
  className?: string;
};

export default function CommitteeCard({ member, className = '' }: CommitteeCardProps) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-slate-50 p-4', className].filter(Boolean).join(' ')}>
      <p className="text-sm font-semibold text-slate-900">{member.role}</p>
      <p className="mt-1 text-sm text-slate-600">{member.name}</p>
      {member.affiliation ? <p className="mt-1 text-sm text-slate-500">{member.affiliation}</p> : null}
    </div>
  );
}

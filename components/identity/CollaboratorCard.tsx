import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

type CollaboratorCardProps = {
  name: string;
  role: string;
  institution: string;
  researchAreas: string[];
  jointPublications: number;
  yearsActive: string;
};

export default function CollaboratorCard({
  name,
  role,
  institution,
  researchAreas,
  jointPublications,
  yearsActive,
}: CollaboratorCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center gap-4">
        <Avatar name={name} size="lg" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="mt-1 text-sm text-slate-600">{role}</p>
          <p className="text-sm text-slate-500">{institution}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {researchAreas.map((area) => (
          <span key={area} className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800">
            {area}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <p>
          Joint publications: <span className="font-semibold text-slate-900">{jointPublications}</span>
        </p>
        <Badge variant="default">{yearsActive}</Badge>
      </div>
    </div>
  );
}

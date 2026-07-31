import React from 'react';
import Avatar from '@/components/ui/Avatar';
import type { TeamMember } from '@/constants/placeholder-research';

type ResearchTeamCardProps = {
  members: TeamMember[];
};

export function ResearchTeamCard({ members }: ResearchTeamCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div key={member.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} size="md" />
            <div>
              <h4 className="font-semibold text-slate-900">{member.name}</h4>
              <p className="text-sm text-slate-600">{member.role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">{member.institution}</p>
          <p className="mt-1 text-sm text-slate-600">{member.specialisation}</p>
          <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
            Active projects: <span className="font-semibold text-slate-900">{member.activeProjects}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

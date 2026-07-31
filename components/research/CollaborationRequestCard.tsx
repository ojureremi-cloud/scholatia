import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import type { CollaborationRequest } from '@/constants/placeholder-research';

type CollaborationRequestCardProps = {
  requests: CollaborationRequest[];
};

export function CollaborationRequestCard({ requests }: CollaborationRequestCardProps) {
  return (
    <ul className="space-y-4">
      {requests.map((request) => (
        <li key={request.id} className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={request.name} />
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{request.name}</h4>
              <p className="text-sm text-slate-600">
                {request.role} · {request.institution}
              </p>
            </div>
            <Badge variant="info">Request</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{request.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {request.researchAreas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800"
              >
                {area}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

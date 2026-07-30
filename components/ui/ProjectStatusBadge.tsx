import React from 'react';

type ProjectStatusBadgeProps = {
  status: 'active' | 'completed' | 'planned' | 'on-hold';
};

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    planned: { label: 'Planned', color: 'bg-yellow-100 text-yellow-800' },
    'on-hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status] || statusConfig['active'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};
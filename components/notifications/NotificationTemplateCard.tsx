import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatCategory, formatCategoryIcon, formatPriority, formatChannel, priorityVariant } from './format';
import type { NotificationTemplate } from '@/types/notifications';

type NotificationTemplateCardProps = {
  template: NotificationTemplate;
};

export default function NotificationTemplateCard({ template }: NotificationTemplateCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{template.icon ?? formatCategoryIcon(template.category)}</span>
          <div>
            <p className="font-semibold text-slate-900">{template.name}</p>
            <p className="mt-1 text-xs text-slate-400">{template.id}</p>
          </div>
        </div>
        <Badge variant={priorityVariant(template.defaultPriority)}>{formatPriority(template.defaultPriority)}</Badge>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">{template.title}</p>
        <p className="mt-1 text-sm text-slate-500">{template.body}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-400">{formatCategory(template.category)}</span>
        <div className="flex flex-wrap gap-1.5">
          {template.defaultChannels.map((channel) => (
            <span key={channel} className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">
              {formatChannel(channel)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

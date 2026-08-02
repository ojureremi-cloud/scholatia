import React from 'react';
import Badge from '@/components/ui/Badge';
import { formatChannel, formatEventType } from './format';
import type { NotificationSubscription } from '@/types/notifications';

type NotificationSubscriptionCardProps = {
  subscription: NotificationSubscription;
};

export default function NotificationSubscriptionCard({ subscription }: NotificationSubscriptionCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">{subscription.sourceId}</p>
          <p className="mt-1 text-xs text-slate-400">{subscription.sourceEntity}</p>
        </div>
        <Badge variant={subscription.active ? 'success' : 'default'}>{subscription.active ? 'Active' : 'Paused'}</Badge>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Events</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {subscription.events.map((event) => (
            <span key={event} className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-600">
              {formatEventType(event)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Channels</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {subscription.channels.map((channel) => (
            <span key={channel} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              {formatChannel(channel)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

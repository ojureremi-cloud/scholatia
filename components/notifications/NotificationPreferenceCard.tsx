'use client';

import React from 'react';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import { formatCategory, formatCategoryIcon, formatChannel } from './format';
import { NOTIFICATION_CHANNELS } from '@/types/notifications';
import type { NotificationChannel, NotificationPreference } from '@/types/notifications';

type NotificationPreferenceCardProps = {
  preference: NotificationPreference;
  onToggleMute?: (id: string) => void;
  onToggleChannel?: (id: string, channel: NotificationChannel) => void;
};

export default function NotificationPreferenceCard({
  preference,
  onToggleMute,
  onToggleChannel,
}: NotificationPreferenceCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{formatCategoryIcon(preference.category)}</span>
          <div>
            <p className="font-semibold text-slate-900">{formatCategory(preference.category)}</p>
            <p className="text-xs text-slate-400">
              {preference.digestFrequency.replace(/-/g, ' ')} ·{' '}
              {preference.quietHours?.enabled
                ? `quiet ${preference.quietHours.start}–${preference.quietHours.end}`
                : 'no quiet hours'}
            </p>
          </div>
        </div>
        {preference.muted ? <Badge variant="danger">Muted</Badge> : null}
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        {NOTIFICATION_CHANNELS.map((channel) => (
          <div key={channel} className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-600">{formatChannel(channel)}</span>
            <Switch
              checked={!preference.muted && preference.channels[channel]}
              onChange={(checked) => {
                if (onToggleMute && checked && preference.muted) onToggleMute(preference.id);
                if (onToggleChannel) onToggleChannel(preference.id, channel);
              }}
            />
          </div>
        ))}
      </div>

      {onToggleMute ? (
        <button
          type="button"
          onClick={() => onToggleMute(preference.id)}
          className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          {preference.muted ? 'Unmute category' : 'Mute category'}
        </button>
      ) : null}
    </div>
  );
}

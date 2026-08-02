'use client';

import React from 'react';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import { formatCategory, formatCategoryIcon, formatFrequency } from './format';
import { NOTIFICATION_DIGEST_FREQUENCIES } from '@/constants/placeholder-notifications';
import type { NotificationDigestFrequency, NotificationPreference } from '@/types/notifications';

type NotificationSettingsCardProps = {
  preference: NotificationPreference;
  onChangeFrequency?: (id: string, frequency: NotificationDigestFrequency) => void;
  onToggleMute?: (id: string) => void;
};

export default function NotificationSettingsCard({
  preference,
  onChangeFrequency,
  onToggleMute,
}: NotificationSettingsCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{formatCategoryIcon(preference.category)}</span>
          <p className="font-semibold text-slate-900">{formatCategory(preference.category)}</p>
        </div>
        {preference.muted ? <Badge variant="danger">Muted</Badge> : null}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Select
          label="Digest frequency"
          value={preference.digestFrequency}
          onChange={(event) => {
            if (onChangeFrequency) {
              onChangeFrequency(preference.id, event.target.value as NotificationDigestFrequency);
            }
          }}
          options={NOTIFICATION_DIGEST_FREQUENCIES.map((frequency) => ({
            label: formatFrequency(frequency),
            value: frequency,
          }))}
        />
        <div className="flex items-end pb-1">
          <Switch
            checked={!preference.muted}
            onChange={() => {
              if (onToggleMute) onToggleMute(preference.id);
            }}
            label="Enabled"
          />
        </div>
      </div>

      {preference.quietHours?.enabled ? (
        <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Quiet hours {preference.quietHours.start}–{preference.quietHours.end} · delivery paused during this window
        </p>
      ) : null}
    </div>
  );
}

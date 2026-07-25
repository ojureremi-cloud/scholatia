'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type DeviceVerificationCardProps = {
  className?: string;
  deviceName?: string;
};

export default function DeviceVerificationCard({ className = '', deviceName = 'Current device' }: DeviceVerificationCardProps) {
  return (
    <div className={['rounded-3xl border border-slate-200 bg-white p-8 shadow-card', className].filter(Boolean).join(' ')}>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">Device verification</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">Verify {deviceName}</h3>
        <p className="mt-2 text-sm text-slate-600">Confirm this device to continue using your trusted academic workspace.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Verify device</Button>
        <Button variant="secondary">Report device</Button>
      </div>
    </div>
  );
}

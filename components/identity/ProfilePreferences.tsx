'use client';

import React, { useState } from 'react';
import Switch from '@/components/ui/Switch';
import Button from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';

type ProfilePreferencesProps = {
  className?: string;
};

export default function ProfilePreferences({ className = '' }: ProfilePreferencesProps) {
  const [preferences, setPreferences] = useState({
    publicProfile: true,
    showEmail: true,
    showPublications: true,
    showEducation: true,
    showAwards: true,
    showAnalytics: false,
    emailNotifications: true,
    weeklyDigest: false,
    mentionAlerts: true,
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <div className={['grid gap-8 lg:grid-cols-2', className].filter(Boolean).join(' ')}>
      <SectionCard eyebrow="Visibility" title="Profile visibility" description="Control how your academic profile is displayed to others.">
        <div className="space-y-5">
          <Switch checked={preferences.publicProfile} onChange={() => toggle('publicProfile')} label="Make profile public" />
          <Switch checked={preferences.showEmail} onChange={() => toggle('showEmail')} label="Show contact email" />
          <Switch checked={preferences.showPublications} onChange={() => toggle('showPublications')} label="Show publications" />
          <Switch checked={preferences.showEducation} onChange={() => toggle('showEducation')} label="Show education history" />
          <Switch checked={preferences.showAwards} onChange={() => toggle('showAwards')} label="Show awards and honours" />
          <Switch checked={preferences.showAnalytics} onChange={() => toggle('showAnalytics')} label="Show citation analytics publicly" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Notifications" title="Notification preferences" description="Choose which Scholatia updates you want to receive.">
        <div className="space-y-5">
          <Switch checked={preferences.emailNotifications} onChange={() => toggle('emailNotifications')} label="Email notifications" />
          <Switch checked={preferences.weeklyDigest} onChange={() => toggle('weeklyDigest')} label="Weekly research digest" />
          <Switch checked={preferences.mentionAlerts} onChange={() => toggle('mentionAlerts')} label="Alerts when I am mentioned" />
        </div>
      </SectionCard>

      <div className="lg:col-span-2">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

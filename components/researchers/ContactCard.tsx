'use client';

import Badge from '@/components/ui/Badge';
import type { ResearcherProfile } from '@/types/researcher';

type ContactCardProps = {
  researcher: ResearcherProfile;
  className?: string;
};

export default function ContactCard({ researcher, className = '' }: ContactCardProps) {
  const { contact, availability } = researcher;
  const details = [
    { label: 'Email', value: contact.email },
    { label: 'Professional email', value: contact.professionalEmail },
    { label: 'Phone', value: contact.phone ?? 'Not listed' },
    { label: 'Office', value: contact.office ?? 'Not listed' },
    { label: 'Address', value: contact.institutionAddress ?? 'Not listed' },
    { label: 'Location', value: contact.city ? `${contact.city}, ${contact.country}` : contact.country },
    { label: 'Timezone', value: contact.timezone ?? 'Not listed' },
  ];
  return (
    <section className={['rounded-3xl border border-slate-200 bg-white p-6 shadow-card', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-slate-900">Contact and availability</h3>
      <dl className="mt-5 space-y-3 text-sm">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0">
            <dt className="font-medium text-slate-500">{detail.label}</dt>
            <dd className="break-all text-slate-900">{detail.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-sm font-medium text-slate-500">Open to</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {availability.openToCollaboration ? <Badge variant="info">Collaboration</Badge> : null}
        {availability.openToSupervision ? <Badge variant="info">Supervision</Badge> : null}
        {availability.openToMentoring ? <Badge variant="info">Mentoring</Badge> : null}
        {availability.openToReviewing ? <Badge variant="info">Reviewing</Badge> : null}
        {availability.openToConsulting ? <Badge variant="info">Consulting</Badge> : null}
        {availability.availableForSpeaking ? <Badge variant="info">Speaking</Badge> : null}
      </div>
      {availability.responseTime ? (
        <p className="mt-3 text-xs text-slate-500">Response time: {availability.responseTime}</p>
      ) : null}
    </section>
  );
}

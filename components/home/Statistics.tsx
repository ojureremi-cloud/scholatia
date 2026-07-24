import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const stats = [
  { label: 'Researchers', value: '48,000+' },
  { label: 'Journals', value: '7,800+' },
  { label: 'Conferences', value: '2,100+' },
  { label: 'Institutions', value: '650+' },
  { label: 'Publishers', value: '420+' },
  { label: 'Countries', value: '134' },
];

export default function Statistics() {
  return (
    <section id="statistics" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Platform metrics"
          title="Measurable impact at a global scale"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <p className="text-4xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const reasons = [
  {
    title: 'Trusted Verification',
    description: 'Robust identity verification and peer-reviewed validation create confidence across researchers, institutions and publishers.',
  },
  {
    title: 'AI-powered Discovery',
    description: 'Intelligent search and recommendation engines help institutions locate the right journals, events, and partners faster.',
  },
  {
    title: 'Global Academic Collaboration',
    description: 'A unified ecosystem for institutions, funders and associations to engage at scale with measurable outcomes.',
  },
];

export default function WhyScholatia() {
  return (
    <section id="about" className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Why Scholatia"
          title="A trusted foundation for academic collaboration"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reasons.map((reason) => (
            <Card key={reason.title} className="shadow-[0_24px_80px_-48px_rgba(15,23,42,0.18)]">
              <h3 className="text-xl font-semibold text-slate-900">{reason.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{reason.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

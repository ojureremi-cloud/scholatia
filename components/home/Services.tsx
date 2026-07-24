import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';

const services = [
  {
    icon: '📅',
    title: 'Scholarly Events Platform',
    description: 'Manage global conferences and academic gatherings with trusted scheduling, registration and insight tools.',
  },
  {
    icon: '📚',
    title: 'Scholarly Publishing Platform',
    description: 'Streamline journal submission, peer review and publication workflows for modern publishers.',
  },
  {
    icon: '🆔',
    title: 'Scholarly Identity Platform',
    description: 'Verify researcher credentials and unify profiles across institutions, grants, and publications.',
  },
  {
    icon: '🏛️',
    title: 'Institutional Engagement Platform',
    description: 'Empower institutions and academic organisations with collaboration tools, partnerships and analytics.',
  },
  {
    icon: '🔍',
    title: 'Scholarly Discovery Marketplace',
    description: 'Find relevant conferences, journals, funding and collaboration opportunities in one place.',
  },
  {
    icon: '🤖',
    title: 'Scholarly Intelligence Platform (AI)',
    description: 'Leverage AI insights to accelerate discovery, recommendation and research impact assessment.',
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Core solutions"
          title="Built to support every stage of scholarly life"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
                <span aria-hidden="true">{service.icon}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

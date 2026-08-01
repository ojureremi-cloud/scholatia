import React from 'react';
import PageLayout from './PageLayout';
import PageHeader from './PageHeader';
import Container from '../ui/Container';
import SectionCard from '../ui/SectionCard';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';

type ModulePlaceholderProps = {
  title: string;
  subtitle: string;
  moduleName: string;
  description: string;
  plannedFeatures: string[];
};

export default function ModulePlaceholder({
  title,
  subtitle,
  moduleName,
  description,
  plannedFeatures,
}: ModulePlaceholderProps) {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title={title}
          subtitle={subtitle}
          actions={<Badge variant="warning">Under Development</Badge>}
        />
        <Alert
          variant="info"
          title="Coming Soon"
          description={`${moduleName} is an architecture-ready placeholder. This module will be fully implemented as part of the Scholatia Phase 1.0 roadmap.`}
        />
        <div className="mt-10">
          <SectionCard eyebrow="Scope" title={`What ${moduleName} will include`} description={description}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {plannedFeatures.map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </Container>
    </PageLayout>
  );
}

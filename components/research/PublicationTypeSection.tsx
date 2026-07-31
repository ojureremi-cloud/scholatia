import React from 'react';
import SectionTitle from '@/components/ui/SectionTitle';
import { PublicationCard } from '@/components/identity';
import type { PublicationEntry } from '@/constants/placeholder-profile';

type PublicationTypeSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  publications: PublicationEntry[];
};

export function PublicationTypeSection({
  eyebrow,
  title,
  description,
  publications,
}: PublicationTypeSectionProps) {
  return (
    <section>
      <SectionTitle eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8 space-y-6">
        {publications.map((publication) => (
          <PublicationCard key={publication.doi} {...publication} />
        ))}
      </div>
    </section>
  );
}

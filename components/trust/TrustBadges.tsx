import React from 'react';
import BadgeCard from './BadgeCard';
import BadgeAwardCard from './BadgeAwardCard';
import type { BadgeAward, BadgeDefinition } from '@/types/trust';

type TrustBadgesProps = {
  definitions: BadgeDefinition[];
  awards: BadgeAward[];
};

export default function TrustBadges({ definitions, awards }: TrustBadgesProps) {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {definitions.map((definition) => (
          <BadgeCard key={definition.id} definition={definition} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <BadgeAwardCard key={award.id} award={award} />
        ))}
      </div>
    </div>
  );
}

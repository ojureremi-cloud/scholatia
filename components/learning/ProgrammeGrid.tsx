import { ProgrammeCard } from './ProgrammeCard';
import type { LearningProgramme } from '@/types/learning';

type ProgrammeGridProps = {
  programmes: LearningProgramme[];
};

export function ProgrammeGrid({ programmes }: ProgrammeGridProps) {
  if (programmes.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programmes.map((programme) => (
        <ProgrammeCard key={programme.id} programme={programme} />
      ))}
    </div>
  );
}

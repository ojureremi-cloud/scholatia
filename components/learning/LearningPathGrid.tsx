import { LearningPathCard } from './LearningPathCard';
import type { LearningPath } from '@/types/learning';

type LearningPathGridProps = {
  paths: LearningPath[];
};

export function LearningPathGrid({ paths }: LearningPathGridProps) {
  if (paths.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {paths.map((path) => (
        <LearningPathCard key={path.id} path={path} />
      ))}
    </div>
  );
}

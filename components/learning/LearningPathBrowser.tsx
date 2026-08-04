'use client';

import { LearningPathGrid } from './LearningPathGrid';
import { LearningEmptyState } from './LearningEmptyState';
import { formatNumber } from './format';
import useLearning from '@/hooks/useLearning';

export function LearningPathBrowser() {
  const { paths } = useLearning();
  const visible = paths();

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
        {formatNumber(visible.length)} path{visible.length === 1 ? '' : 's'} available
      </p>
      {visible.length === 0 ? (
        <LearningEmptyState
          title="No learning paths found"
          description="There are no learning paths available right now. Please check back later."
        />
      ) : (
        <LearningPathGrid paths={visible} />
      )}
    </div>
  );
}

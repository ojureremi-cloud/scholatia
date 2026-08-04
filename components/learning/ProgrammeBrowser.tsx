'use client';

import { ProgrammeGrid } from './ProgrammeGrid';
import { LearningEmptyState } from './LearningEmptyState';
import { formatNumber } from './format';
import useLearning from '@/hooks/useLearning';

export function ProgrammeBrowser() {
  const { programmes } = useLearning();
  const visible = programmes();

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500 dark:text-slate-400" role="status">
        {formatNumber(visible.length)} programme{visible.length === 1 ? '' : 's'} available
      </p>
      {visible.length === 0 ? (
        <LearningEmptyState
          title="No programmes found"
          description="There are no programmes available right now. Please check back later."
        />
      ) : (
        <ProgrammeGrid programmes={visible} />
      )}
    </div>
  );
}

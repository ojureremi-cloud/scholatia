import { Alert } from '@/components/ui';
import type { WorkflowInsight } from '@/types/workflows';

type WorkflowInsightsProps = {
  insights: WorkflowInsight[];
};

const toneVariant = {
  positive: 'success',
  warning: 'warning',
  neutral: 'info',
} as const;

export function WorkflowInsights({ insights }: WorkflowInsightsProps) {
  if (insights.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <Alert
          key={insight.id}
          variant={toneVariant[insight.tone]}
          title={insight.title}
          description={insight.description}
        />
      ))}
    </div>
  );
}

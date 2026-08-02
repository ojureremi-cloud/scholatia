import { Badge } from '@/components/ui';
import type { WorkflowTemplateKind } from '@/types/workflows';
import { formatKind, formatKindIcon, formatKindVariant } from './format';

type WorkflowBadgeProps = {
  kind: WorkflowTemplateKind;
};

export function WorkflowBadge({ kind }: WorkflowBadgeProps) {
  return (
    <Badge variant={formatKindVariant(kind)}>
      {formatKindIcon(kind)} {formatKind(kind)}
    </Badge>
  );
}

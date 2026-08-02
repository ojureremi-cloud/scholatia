import { WorkflowTemplateCard } from './WorkflowTemplateCard';
import type { WorkflowTemplate } from '@/types/workflows';

type WorkflowTemplatesProps = {
  templates: WorkflowTemplate[];
};

export function WorkflowTemplates({ templates }: WorkflowTemplatesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <WorkflowTemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

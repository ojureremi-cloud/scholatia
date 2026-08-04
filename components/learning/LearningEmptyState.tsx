import EmptyState from '@/components/ui/EmptyState';

type LearningEmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function LearningEmptyState({ title, description, action }: LearningEmptyStateProps) {
  return <EmptyState title={title} description={description} action={action} />;
}

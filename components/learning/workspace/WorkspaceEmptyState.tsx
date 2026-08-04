import EmptyState from '@/components/ui/EmptyState';

type WorkspaceEmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function WorkspaceEmptyState({ title, description, action }: WorkspaceEmptyStateProps) {
  return <EmptyState title={title} description={description} action={action} />;
}

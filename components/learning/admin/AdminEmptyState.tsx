import EmptyState from '@/components/ui/EmptyState';

type AdminEmptyStateProps = {
  title: string;
  description: string;
};

export function AdminEmptyState({ title, description }: AdminEmptyStateProps) {
  return <EmptyState title={title} description={description} />;
}

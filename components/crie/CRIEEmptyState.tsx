import EmptyState from '@/components/ui/EmptyState';
import type { ReactNode } from 'react';

type CRIEEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function CRIEEmptyState({ title, description, action }: CRIEEmptyStateProps) {
  return <EmptyState title={title} description={description} action={action} />;
}

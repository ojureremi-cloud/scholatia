import ErrorState from '@/components/ui/ErrorState';

type WorkspaceErrorProps = {
  title?: string;
  description?: string;
};

export function WorkspaceError({
  title = 'Workspace unavailable',
  description = 'Your learning workspace could not be loaded. Please try again later.',
}: WorkspaceErrorProps) {
  return <ErrorState title={title} description={description} />;
}

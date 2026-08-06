import ErrorState from '@/components/ui/ErrorState';

type CRIEErrorProps = {
  title?: string;
  description?: string;
};

export function CRIEError({
  title = 'CRIE content could not be loaded',
  description = 'The environment hit an unexpected error. Refresh the page or try again shortly.',
}: CRIEErrorProps) {
  return <ErrorState title={title} description={description} />;
}

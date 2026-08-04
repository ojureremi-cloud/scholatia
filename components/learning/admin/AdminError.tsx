import ErrorState from '@/components/ui/ErrorState';

type AdminErrorProps = {
  title: string;
  description: string;
};

export function AdminError({ title, description }: AdminErrorProps) {
  return <ErrorState title={title} description={description} />;
}

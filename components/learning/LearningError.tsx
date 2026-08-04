import ErrorState from '@/components/ui/ErrorState';

type LearningErrorProps = {
  title?: string;
  description?: string;
};

export function LearningError({
  title = 'Something went wrong',
  description = 'The learning content could not be loaded. Please try again later.',
}: LearningErrorProps) {
  return <ErrorState title={title} description={description} />;
}

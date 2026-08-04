import Skeleton from '@/components/ui/Skeleton';

export function LearningLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading learning content">
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

import Skeleton from '@/components/ui/Skeleton';

export function WorkspaceLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading learning workspace">
      <Skeleton className="h-40 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </div>
  );
}

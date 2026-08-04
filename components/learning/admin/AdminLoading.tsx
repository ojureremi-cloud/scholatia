import Skeleton from '@/components/ui/Skeleton';

export function AdminLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading operations workspace">
      <Skeleton className="h-48 w-full rounded-[2rem]" />
      <div className="grid gap-8 xl:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

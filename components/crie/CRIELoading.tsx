import Skeleton from '@/components/ui/Skeleton';

export function CRIELoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading CRIE content">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-[1.75rem]" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-[1.75rem]" />
          <Skeleton className="h-56 rounded-[1.75rem]" />
        </div>
        <Skeleton className="h-72 rounded-[1.75rem]" />
      </div>
    </div>
  );
}

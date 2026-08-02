'use client';

import { useReviews } from '@/hooks';
import { ReviewCycleCard } from './ReviewCycleCard';
import { ApprovalCard } from './ApprovalCard';

export function ReviewBrowser() {
  const {
    activeCycles,
    completedCycles,
    myReviews,
    pendingReviews,
    pendingApprovals,
    decidedApprovals,
  } = useReviews();

  return (
    <div className="space-y-10">
      <section>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Active cycles ({activeCycles.length})</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {activeCycles.map((cycle) => (
            <ReviewCycleCard key={cycle.id} cycle={cycle} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Pending approvals ({pendingApprovals.length})</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {pendingApprovals.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">My reviews ({myReviews.length})</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {myReviews.slice(0, 6).map((review) => (
            <div key={review.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{review.title ?? review.sourceId ?? review.id}</p>
              <p className="mt-1 text-xs text-slate-400">
                {review.reviewerName} · {review.kind} · round {review.round} · {review.status}
              </p>
              {review.decision && <p className="mt-2 text-xs font-bold text-indigo-600">Decision: {review.decision}</p>}
            </div>
          ))}
        </div>
      </section>

      {pendingReviews.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Needs attention ({pendingReviews.length})</h3>
          <p className="mt-2 text-sm text-slate-400">{pendingReviews.length} reviews are invited, accepted, or in progress.</p>
        </section>
      )}

      {completedCycles.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Completed cycles ({completedCycles.length})</h3>
          <p className="mt-2 text-sm text-slate-400">{completedCycles.length} cycles closed.</p>
        </section>
      )}

      {decidedApprovals.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Decided approvals ({decidedApprovals.length})</h3>
          <p className="mt-2 text-sm text-slate-400">{decidedApprovals.length} approvals decided.</p>
        </section>
      )}
    </div>
  );
}

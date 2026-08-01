import React from 'react';
import { ReviewStatusBadge, SponsoredLabelBadge } from './AdsBadge';
import { formatPlacement } from './format';
import type { AdCreative, PromotableObject } from '@/types/ads';

type CreativeCardProps = {
  creative: AdCreative;
  promotedObject?: PromotableObject;
};

export default function CreativeCard({ creative, promotedObject }: CreativeCardProps) {
  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SponsoredLabelBadge label={creative.label} />
        <ReviewStatusBadge status={creative.reviewStatus} />
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{creative.headline}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{creative.primaryText}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
          {creative.callToAction}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {formatPlacement(creative.format)}
        </span>
      </div>
      {promotedObject ? (
        <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Promotes:</span> {promotedObject.title}
        </div>
      ) : (
        <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-medium text-slate-700">Promotes:</span> {creative.promotedObjectId}
        </div>
      )}
    </article>
  );
}

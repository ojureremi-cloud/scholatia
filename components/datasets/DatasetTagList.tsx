import React from 'react';

type DatasetTagListProps = {
  tags: string[];
  limit?: number;
};

export function DatasetTagList({ tags, limit }: DatasetTagListProps) {
  const visible = limit ? tags.slice(0, limit) : tags;
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
        >
          {tag}
        </span>
      ))}
      {limit && tags.length > limit ? (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
          +{tags.length - limit} more
        </span>
      ) : null}
    </div>
  );
}

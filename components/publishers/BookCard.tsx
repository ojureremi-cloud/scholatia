'use client';

import React from 'react';
import type { PublisherBook } from '@/types/publisher';

type BookCardProps = {
  books: PublisherBook[];
  className?: string;
};

export default function BookCard({ books, className = '' }: BookCardProps) {
  if (books.length === 0) {
    return <p className="text-sm text-slate-500">No books recorded for this publisher.</p>;
  }
  return (
    <div className={['grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className].filter(Boolean).join(' ')}>
      {books.map((entry) => (
        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-slate-900">{entry.title}</p>
            {entry.openAccess ? (
              <span className="flex-shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">
                Open access
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-500">{entry.type}</p>
          {entry.authors.length > 0 ? (
            <p className="mt-2 text-xs leading-5 text-slate-600">{entry.authors.join(', ')}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            {entry.year ? <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.year}</span> : null}
            {entry.pages !== undefined ? (
              <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">{entry.pages} pp</span>
            ) : null}
            {entry.isbn ? <span className="rounded-full bg-white px-2 py-0.5 font-medium text-slate-700">ISBN {entry.isbn}</span> : null}
          </div>
          {entry.series ? <p className="mt-3 text-xs text-slate-500">Series: {entry.series}</p> : null}
        </div>
      ))}
    </div>
  );
}

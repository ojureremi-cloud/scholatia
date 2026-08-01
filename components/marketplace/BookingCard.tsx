import React from 'react';
import { BookingStatusBadge } from './MarketplaceBadge';
import { formatDate, formatPrice } from './format';
import type { MarketplaceBooking } from '@/types/marketplace';

type BookingCardProps = {
  booking: MarketplaceBooking;
};

export default function BookingCard({ booking }: BookingCardProps) {
  const hours = Math.round(booking.durationMinutes / 60 * 10) / 10;

  return (
    <article className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{booking.id}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{booking.buyerName}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="mt-4 flex-1 space-y-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
        <p className="text-slate-700">
          {booking.location === 'online' ? 'Online' : 'Onsite'} · {hours} hour{hours === 1 ? '' : 's'}
          {booking.timezone ? ` · ${booking.timezone}` : ''}
        </p>
        <p className="font-semibold text-slate-900">Scheduled {formatDate(booking.scheduledFor)}</p>
        {booking.notes ? <p className="text-xs text-slate-500">{booking.notes}</p> : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Booked {formatDate(booking.createdAt)}</span>
        <span className="text-lg font-semibold text-slate-900">{formatPrice(booking.price)}</span>
      </div>
    </article>
  );
}

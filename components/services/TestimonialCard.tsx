import React from 'react';
import { formatDate } from './format';
import type { ServiceTestimonial } from '@/types/services';

type TestimonialCardProps = {
  testimonial: ServiceTestimonial;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{index < Math.round(testimonial.rating) ? '★' : '☆'}</span>
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">“{testimonial.comment}”</blockquote>
      <figcaption className="mt-4 border-t border-slate-100 pt-3">
        <p className="font-semibold text-slate-900">{testimonial.clientName}</p>
        <p className="text-xs text-slate-500">
          {testimonial.clientRole ? `${testimonial.clientRole} · ` : ''}
          {testimonial.clientInstitution ? `${testimonial.clientInstitution} · ` : ''}
          {testimonial.serviceTitle ? `${testimonial.serviceTitle} · ` : ''}
          {formatDate(testimonial.date)}
        </p>
      </figcaption>
    </figure>
  );
}

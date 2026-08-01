import React from 'react';
import Button from '../ui/Button';

export default function Hero() {
  return (
    <section id="home" className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
              Global scholarly infrastructure
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              The World&apos;s Scholarly Infrastructure Platform
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Connecting researchers, students, institutions, journals, conferences, publishers and academic communities.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/conferences" className="rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
                Explore Conferences
              </Button>
              <Button variant="secondary" href="/journals" className="rounded-full">
                Find Journals
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-100 via-slate-100 to-white blur-3xl" />
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/80 sm:p-10">
              <div className="mb-8 rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-inner shadow-slate-100/80">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Trusted research data</p>
                <p className="mt-4 text-lg font-semibold text-slate-900">Enterprise-ready connections for every academic community.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">48k+</p>
                  <p className="mt-2 text-sm text-slate-600">Verified researchers</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">1.2k</p>
                  <p className="mt-2 text-sm text-slate-600">Partner institutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

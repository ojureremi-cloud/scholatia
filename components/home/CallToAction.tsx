import React from 'react';
import Button from '../ui/Button';

export default function CallToAction() {
  return (
    <section id="contact" className="bg-gradient-to-r from-slate-900 via-sky-700 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-900/20 sm:p-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Join Scholatia</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Discover one platform that powers the future of global research.
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-200">
              Create a free account to access trusted scholarly infrastructure, build partnerships across borders, and leverage AI-enabled research intelligence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/register" className="rounded-full bg-white text-slate-900 shadow-md shadow-slate-900/20 hover:bg-slate-100">
                Create Free Account
              </Button>
              <Button variant="ghost" href="#services" className="rounded-full">
                Explore Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

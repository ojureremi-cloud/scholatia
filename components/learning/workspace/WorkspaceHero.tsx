'use client';

import useLearning from '@/hooks/useLearning';

export function WorkspaceHero() {
  const { currentUserName } = useLearning();
  const firstName = currentUserName.split(' ')[0] ?? 'Researcher';

  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-700 to-sky-900 p-8 text-white shadow-lg sm:p-12">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Learning Workspace</p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Welcome back, {firstName}.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
        Your reading, notes, journal, portfolio, and competency growth in one focused workspace — resume where you
        left off and keep your research practice moving.
      </p>
    </section>
  );
}

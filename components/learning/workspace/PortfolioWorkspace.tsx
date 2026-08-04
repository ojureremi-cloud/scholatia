'use client';

import Badge from '@/components/ui/Badge';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { WorkspaceWidgets } from './WorkspaceWidgets';
import { formatDate, mentorshipStatusLabel, mentorshipStatusVariant, portfolioKindIcon, portfolioKindLabel } from '../format';
import useLearning from '@/hooks/useLearning';

function ItemList({ title, items }: { title: string; items: { id: string; title: string; date?: string }[] }) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
                {item.date ? <p className="text-xs text-slate-400">{formatDate(item.date)}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PortfolioWorkspace() {
  const { portfolioWorkspace } = useLearning();
  const model = portfolioWorkspace();

  return (
    <>
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Portfolio workspace
            </h2>
            <p className="mt-1 text-xs text-slate-400">Evidence across research, teaching, and professional practice.</p>
          </div>
          <Badge variant="info">Completion {Math.round(model.completion)}%</Badge>
        </div>
        <div className="mt-4">
          <ProgressBar percent={model.completion} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {model.portfolios.map((portfolio) => (
            <Badge key={portfolio.id}>
              {portfolioKindIcon(portfolio.kind)} {portfolioKindLabel(portfolio.kind)} · {portfolio.items.length}
            </Badge>
          ))}
        </div>
      </section>

      {model.portfolios.length === 0 ? (
        <WorkspaceEmptyState title="No portfolios" description="Add evidence to start building your portfolio." />
      ) : null}

      <WorkspaceWidgets>
        <ItemList title="Certificates" items={model.certificates.map((item) => ({ id: item.id, title: item.title, date: item.issuedAt }))} />
        <ItemList title="Badges" items={model.badges.map((item) => ({ id: item.id, title: item.title, date: item.issuedAt }))} />
        <ItemList title="Research outputs" items={model.researchOutputs.map((item) => ({ id: item.id, title: item.title, date: item.date }))} />
        <ItemList title="Teaching activities" items={model.teachingActivities.map((item) => ({ id: item.id, title: item.title, date: item.date }))} />
        <ItemList title="Projects" items={model.projects.map((item) => ({ id: item.id, title: item.title, date: item.date }))} />
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Mentorship
          </h2>
          {model.mentorship.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No active mentorships.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {model.mentorship.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.mentorName}</p>
                    <p className="text-xs text-slate-400">{formatDate(item.startedAt)}</p>
                  </div>
                  <Badge variant={mentorshipStatusVariant(item.status)}>{mentorshipStatusLabel(item.status)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </WorkspaceWidgets>
    </>
  );
}

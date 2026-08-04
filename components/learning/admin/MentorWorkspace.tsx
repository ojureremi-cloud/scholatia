'use client';

import Badge from '@/components/ui/Badge';
import StatisticCard from '@/components/ui/StatisticCard';
import useLearning from '@/hooks/useLearning';
import {
  formatPercent,
  mentorKindIcon,
  mentorKindLabel,
  mentorshipStatusLabel,
  mentorshipStatusVariant,
  portfolioKindIcon,
  portfolioKindLabel,
} from '../format';
import { ProgressBar } from '../ProgressBar';
import { Chip, Panel, Row } from '../primitives';
import { AdminEmptyState } from './AdminEmptyState';
import { AdminHeader } from './AdminHeader';
import { AdminWidgets } from './AdminWidgets';

export function MentorWorkspace() {
  const { mentor } = useLearning();
  const model = mentor();

  return (
    <>
      <AdminHeader
        eyebrow="Mentorship operations"
        title="Mentor Workspace"
        description="Supervision, research mentoring, milestone tracking, and mentee portfolio reviews."
        icon="🧭"
      />

      <AdminWidgets>
        <StatisticCard icon="🤝" title="Total mentorships" value={String(model.mentorships.length)} />
        <StatisticCard icon="✅" title="Active" value={String(model.active.length)} />
        <StatisticCard icon="⏳" title="Pending requests" value={String(model.requests.length)} />
        <StatisticCard icon="🎯" title="As mentor" value={String(model.asMentor.length)} />
      </AdminWidgets>

      <Panel eyebrow="Agenda" title="Next milestones" icon="🗓️">
        {model.agenda.length === 0 ? (
          <AdminEmptyState title="No upcoming milestones" description="No mentorship milestones are in progress." />
        ) : (
          <ul className="space-y-3">
            {model.agenda.map(({ mentorship, milestone }) => (
              <li key={milestone.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <Row>
                  <Chip tone="info" icon={mentorKindIcon(mentorship.kind)}>
                    {mentorKindLabel(mentorship.kind)}
                  </Chip>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {mentorship.mentorName} → {mentorship.menteeName}
                  </span>
                  <Badge variant={mentorshipStatusVariant(mentorship.status)}>{mentorshipStatusLabel(mentorship.status)}</Badge>
                </Row>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{milestone.title}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Weekly checks" title="Milestone progress" icon="📈">
        {model.weeklyChecks.length === 0 ? (
          <AdminEmptyState title="No checks yet" description="Start a mentorship to begin weekly milestone checks." />
        ) : (
          <ul className="space-y-4">
            {model.weeklyChecks.map(({ mentorship, milestone, progress }) => (
              <li key={milestone.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{milestone.title}</p>
                  <span className="text-xs text-slate-400">
                    {mentorship.mentorName} · {mentorship.menteeName}
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar percent={progress} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{formatPercent(progress)} of milestones achieved</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Mentee portfolios" title="Portfolio coverage" icon="📁">
        {model.menteePortfolios.length === 0 ? (
          <AdminEmptyState title="No mentee portfolios" description="Portfolios will appear once mentorships begin." />
        ) : (
          <ul className="space-y-3">
            {model.menteePortfolios.map((entry) => (
              <li key={entry.mentee} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <Row>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{entry.menteeName}</span>
                  <span className="text-xs text-slate-400">@{entry.mentee}</span>
                  <span className="ml-auto text-xs text-slate-400">{formatPercent(entry.coverage)} coverage</span>
                </Row>
                <div className="mt-2">
                  <ProgressBar percent={entry.coverage} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.portfolios.map((portfolio) => (
                    <Chip key={portfolio.id} tone="default" icon={portfolioKindIcon(portfolio.kind)}>
                      {portfolioKindLabel(portfolio.kind)} · {portfolio.items.length}
                    </Chip>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel eyebrow="Network" title="Mentorship activity" icon="🌐">
        {model.activity.length === 0 ? (
          <AdminEmptyState title="No activity" description="Mentorship activity will appear here." />
        ) : (
          <ul className="space-y-3">
            {model.activity.map((stat) => (
              <Row key={stat.username}>
                <Chip tone="info">{stat.username}</Chip>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.active} active · {stat.requested} requested · {stat.completed} completed
                </span>
                <span className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">{stat.total} total</span>
              </Row>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

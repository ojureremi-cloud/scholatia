import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  NotificationAlert,
  NotificationAnalytics,
  NotificationBrowser,
  NotificationChannelCard,
  NotificationDeliveryCard,
  NotificationDigestCard,
  NotificationPortfolioCard,
  NotificationPreferenceCard,
  NotificationStatistics,
  NotificationSubscriptionCard,
  NotificationSummaryCard,
  NotificationTemplateCard,
  NotificationTimeline,
  formatNumber,
} from '@/components/notifications';
import {
  ALERTS,
  DELIVERIES,
  DIGESTS,
  FEATURED_ALERT,
  FEATURED_DIGEST,
  FEATURED_NOTIFICATION,
  FEATURED_PREFERENCE,
  FEATURED_SUBSCRIPTION,
  FEATURED_TEMPLATE,
  LIFECYCLE_NOTIFICATIONS,
  NOTIFICATION_ANALYTICS,
  NOTIFICATION_PORTFOLIO,
  NOTIFICATION_STATISTICS,
  PREFERENCES,
  SUBSCRIPTIONS,
  TEMPLATES,
} from '@/constants/placeholder-notifications';
import { groupByCategory } from '@/lib/notifications';

export default function NotificationsPage() {
  const groupedByCategory = groupByCategory(NOTIFICATION_PORTFOLIO.notifications);
  const activeAlerts = ALERTS.filter((alert) => !alert.acknowledged);

  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Unified Notification Engine"
          subtitle="The canonical event-driven notification backbone of the Scholatia ecosystem — every existing and future module emits into this single typed graph. This is not messaging and not an activity feed: it is the delivery infrastructure those later phases will build on, with routing decomposed into channels, templates, deliveries, digests, and subscriptions. Every notification references its source record by canonical ID and never duplicates a record owned by another module."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/services">
                Services
              </Button>
              <Button variant="secondary" size="sm" href="/commerce">
                Commerce
              </Button>
              <Button variant="outline" size="sm" href="/marketplace">
                Marketplace
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Engine overview"
            title="Notification statistics"
            description="Headline signals across the notification engine: total notifications, categories, templates, deliveries, subscriptions, and active alerts — computed by the pure engine."
          />
          <div className="mt-8">
            <NotificationStatistics statistics={NOTIFICATION_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Delivery intelligence"
            title="Notification analytics"
            description="Delivery, open, and click rates across channels, plus the delivery volume per channel — derived by the engine from the delivery ledger."
          />
          <div className="mt-8">
            <NotificationAnalytics analytics={NOTIFICATION_ANALYTICS} />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {NOTIFICATION_ANALYTICS.deliveryByChannel.map((stat) => (
              <NotificationChannelCard
                key={stat.channel}
                stat={stat}
                totalDelivered={NOTIFICATION_ANALYTICS.totalDelivered}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Time-critical"
            title="Active alerts"
            description="Urgent and high-priority alerts surfaced outside the standard list — funding deadlines, project reports, renewals, and budget warnings. Acknowledging an alert removes it from the active set."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {activeAlerts.map((alert) => (
              <NotificationAlert key={alert.id} alert={alert} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Inbox"
            title="Notification centre"
            description="Search all notifications, filter by category and status, sort by recency, priority, or category, and toggle unread-only. Read, unread, archive, and dismiss actions update the inbox state."
          />
          <div className="mt-8">
            <NotificationBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Summary"
            title="Inbox status"
            description="The aggregate status distribution of the notification inbox and the delivery success rate."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <NotificationSummaryCard
              unread={NOTIFICATION_STATISTICS.totalUnread}
              read={NOTIFICATION_STATISTICS.totalRead}
              archived={NOTIFICATION_STATISTICS.totalArchived}
              dismissed={NOTIFICATION_STATISTICS.totalDismissed}
              deliveryRate={NOTIFICATION_STATISTICS.deliverySuccessRate}
            />
            <div className="lg:col-span-2">
              <NotificationPortfolioCard portfolio={NOTIFICATION_PORTFOLIO} />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Research lifecycle"
            title="Lifecycle-stage notifications"
            description="Notifications grouped by the canonical research lifecycle stage of their source record — from idea through knowledge transfer."
          />
          <div className="mt-8 space-y-6">
            {LIFECYCLE_NOTIFICATIONS.map((group) => (
              <div
                key={group.stageId}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold capitalize text-slate-900">{group.stageId.replace(/-/g, ' ')}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {formatNumber(group.items.length)}
                  </span>
                </div>
                <div className="mt-4">
                  <NotificationTimeline notifications={group.items.slice(0, 3)} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Modules"
            title="Notifications by category"
            description="Every module that emits notifications maps to one category — identity, research, projects, datasets, discovery, intelligence, trust, advertising, commerce, marketplace, services, publishing, publishers, institutions, funding, conferences, and journals."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {groupedByCategory.map((group) => (
              <NotificationTimeline key={group.category} notifications={group.items.slice(0, 4)} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Consolidation"
            title={FEATURED_DIGEST.frequency === 'daily' ? 'Daily digest' : 'Weekly digest'}
            description="Periodic digests consolidate the notifications generated over a window for a target, summarised by category and priority by the engine."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DIGESTS.map((digest) => (
              <NotificationDigestCard key={digest.id} digest={digest} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Control"
            title="Notification preferences"
            description="Per-category, per-channel delivery preferences with quiet hours and digest frequency. Every category can be muted independently and routed through any combination of the seven channels."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PREFERENCES.map((preference) => (
              <NotificationPreferenceCard key={preference.id} preference={preference} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Reusable"
            title="Notification templates"
            description="Reusable templates bound to categories with default priority and channels — the same body rendering later phases (email, push, mobile) will reuse."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <NotificationTemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Standing"
            title="Event subscriptions"
            description="Standing subscriptions to events for specific source records — projects, journals, conferences, funding, datasets, services, and orders — routed through the channels each subscription enables."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SUBSCRIPTIONS.map((subscription) => (
              <NotificationSubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Ledger"
            title="Delivery log"
            description="The delivery ledger per notification per channel — queued, sent, delivered, opened, clicked, and failed states with timestamps."
          />
          <div className="mt-8 grid gap-4">
            {DELIVERIES.slice(0, 10).map((delivery) => (
              <NotificationDeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Featured"
            title="Featured notification"
            description={FEATURED_NOTIFICATION.body}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Notification</p>
              <p className="mt-3 font-semibold text-slate-900">{FEATURED_NOTIFICATION.title}</p>
              <p className="mt-1 text-xs text-slate-400">{FEATURED_NOTIFICATION.category}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Alert</p>
              <p className="mt-3 font-semibold text-slate-900">{FEATURED_ALERT.title}</p>
              <p className="mt-1 text-xs text-slate-400">{FEATURED_ALERT.priority} priority</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Preference</p>
              <p className="mt-3 font-semibold capitalize text-slate-900">{FEATURED_PREFERENCE.category}</p>
              <p className="mt-1 text-xs text-slate-400">{FEATURED_PREFERENCE.digestFrequency} digest</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Subscription</p>
              <p className="mt-3 font-semibold text-slate-900">{FEATURED_SUBSCRIPTION.sourceId}</p>
              <p className="mt-1 text-xs text-slate-400">{FEATURED_SUBSCRIPTION.sourceEntity}</p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Template"
            title={FEATURED_TEMPLATE.name}
            description="The featured template with its placeholder body, default priority, and default channels."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <NotificationTemplateCard template={FEATURED_TEMPLATE} />
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Notification data is illustrative"
            description="All notifications, preferences, templates, subscriptions, deliveries, digests, alerts, statistics, and analytics are derived from existing placeholder modules and computed by the pure engine in lib/notifications.ts. Every notification references a canonical source record by ID — researchers, journals, conferences, institutions, grants, datasets, manuscripts, publishers, projects, orders, services, listings, campaigns, and subscriptions. Live delivery will connect the engine to email, push, mobile, and enterprise rails in later phases — no real emails or pushes are sent here."
          />
        </div>
      </Container>
    </PageLayout>
  );
}

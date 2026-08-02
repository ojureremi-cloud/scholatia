import { PageLayout, PageHeader } from '@/components/layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SectionTitle from '@/components/ui/SectionTitle';
import Alert from '@/components/ui/Alert';
import {
  ActionItemList,
  ConversationBrowser,
  ConversationSummaryCard,
  MessageAnalytics,
  MessagePortfolioCard,
  MessageStatistics,
  PinnedMessages,
  StarredMessages,
  formatConversationType,
  formatNumber,
} from '@/components/messages';
import {
  ALL_ACTION_ITEMS,
  ALL_MESSAGES,
  ARCHIVES,
  CONVERSATIONS,
  FEATURED_SUMMARY,
  MESSAGING_ANALYTICS,
  MESSAGING_PORTFOLIO,
  MESSAGING_STATISTICS,
  MUTES,
  PINNED_MESSAGES,
  STARRED_MESSAGES,
} from '@/constants/placeholder-messages';

export default function MessagesPage() {
  return (
    <PageLayout>
      <Container className="py-16 sm:py-24">
        <PageHeader
          title="Scholatia Messaging Platform"
          subtitle="The canonical scholarly messaging layer of the Scholatia ecosystem — every conversation references a canonical record (a researcher, journal, conference, institution, publisher, project, grant, order, service, or listing) and every message carries structured attachments, mentions, reactions, hashtags, pins, stars, and read receipts. Delivery is decomposed into statuses and read receipts, and AI-ready summaries, action items, meeting notes, reply suggestions, and collaboration opportunities are derived from the typed model — so future AI assistants need no schema changes."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" href="/notifications">
                Notifications
              </Button>
              <Button variant="secondary" size="sm" href="/services">
                Services
              </Button>
              <Button variant="outline" size="sm" href="/marketplace">
                Marketplace
              </Button>
            </div>
          }
        />

        <section>
          <SectionTitle
            eyebrow="Platform overview"
            title="Messaging statistics"
            description="Headline signals across the messaging platform — conversations, messages, participants, attachments, reactions, pins, stars, archives, and mutes — computed by the pure engine."
          />
          <div className="mt-8">
            <MessageStatistics statistics={MESSAGING_STATISTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Engagement"
            title="Messaging analytics"
            description="Per-day volume, reply and edit rates, reactions per message, and the busiest threads — derived by the engine from the message ledger."
          />
          <div className="mt-8">
            <MessageAnalytics analytics={MESSAGING_ANALYTICS} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Inbox"
            title="Conversations"
            description="Every conversation kind maps 1:1 to a Scholatia module — direct, group, institution, publisher, conference, journal, project, grant, marketplace, service, and support. Search across messages, filter by type, sort by recency or unread count, and read or reply in the thread pane."
          />
          <div className="mt-8">
            <ConversationBrowser />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="AI-ready"
            title="Featured conversation summary"
            description="The engine derives key topics, action items, open questions, meeting notes, collaboration opportunities, and a suggested reply from the typed message graph of a conversation."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {FEATURED_SUMMARY ? <ConversationSummaryCard summary={FEATURED_SUMMARY} /> : null}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Across the platform</p>
              <p className="mt-1 text-sm text-slate-500">Extracted action items detected across every conversation.</p>
              <div className="mt-4">
                <ActionItemList items={ALL_ACTION_ITEMS} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Focused"
            title="Pinned & starred messages"
            description="Pins are per-conversation anchors; stars are per-user bookmarks. Both are derived from the message graph and can be toggled from the thread."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <PinnedMessages
              pinned={PINNED_MESSAGES}
              messages={ALL_MESSAGES}
              conversations={CONVERSATIONS}
              currentUserId="ojuri"
            />
            <StarredMessages starred={STARRED_MESSAGES} messages={ALL_MESSAGES} currentUserId="ojuri" />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Distribution"
            title="Conversation portfolio"
            description="The aggregate root of the messaging platform: conversation counts per type with unread signals, plus live typing indicators."
          />
          <div className="mt-8">
            <MessagePortfolioCard portfolio={MESSAGING_PORTFOLIO} />
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Coverage"
            title="Conversation types"
            description="All eleven conversation kinds are seeded against canonical records, each mapping to the module it serves."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MESSAGING_STATISTICS.byType.map((stat) => (
              <div key={stat.type} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{formatConversationType(stat.type)}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{formatNumber(stat.count)}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {stat.unread > 0 ? `${formatNumber(stat.unread)} unread` : 'all read'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="State"
            title="Archives & mutes"
            description="Per-user archive and mute state — archives remove a conversation from the active inbox, mutes silence it while keeping it visible."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Archived</p>
              <ul className="mt-3 space-y-1">
                {ARCHIVES.map((entry) => (
                  <li key={`${entry.conversationId}-${entry.archivedBy}`} className="text-sm text-slate-600">
                    {CONVERSATIONS.find((c) => c.id === entry.conversationId)?.title ?? entry.conversationId}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Muted</p>
              <ul className="mt-3 space-y-1">
                {MUTES.map((entry) => (
                  <li key={`${entry.conversationId}-${entry.mutedBy}`} className="text-sm text-slate-600">
                    {CONVERSATIONS.find((c) => c.id === entry.conversationId)?.title ?? entry.conversationId}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-16">
          <Alert
            variant="warning"
            title="Messaging data is illustrative"
            description="All conversations, messages, attachments, reactions, read receipts, pins, stars, archives, mutes, statistics, and analytics are derived from existing placeholder modules and computed by the pure engine in lib/messages.ts. Every conversation references a canonical source record by ID — researchers, journals, conferences, institutions, publishers, projects, grants, orders, services, and listings — and supersedes the legacy lightweight marketplace conversation model. Live delivery, push, email, and mobile rails, and the activity feed that consumes this graph, arrive in later phases — no real messages are sent here."
          />
        </div>
      </Container>
    </PageLayout>
  );
}

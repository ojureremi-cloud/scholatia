'use client';

import React from 'react';
import useMessages from '@/hooks/useMessages';
import ConversationSearchPanel from './ConversationSearchPanel';
import ConversationTypeTabs from './ConversationTypeTabs';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import MessageSearchResults from './MessageSearchResults';

const CURRENT_USER = 'ojuri';

export default function ConversationBrowser() {
  const {
    conversations,
    allConversations,
    searchResults,
    activeConversation,
    activeMessages,
    activeTyping,
    query,
    setQuery,
    type,
    setType,
    sort,
    setSort,
    showUnreadOnly,
    toggleUnreadOnly,
    openConversation,
    reactToMessage,
    unreact,
    deleteMessageById,
    pinMessageById,
    unpinMessageById,
    toggleStarOnMessage,
    canSend,
    send,
    unreadByConversation,
    featuredSummary,
    starredMessageIds,
  } = useMessages();

  return (
    <div className="space-y-6">
      <ConversationSearchPanel
        query={query}
        onQueryChange={setQuery}
        type={type}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={toggleUnreadOnly}
      />

      {query.trim() ? (
        <MessageSearchResults messages={searchResults} conversations={allConversations} query={query} currentUserId={CURRENT_USER} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ConversationTypeTabs active={type} onChange={setType} />
            <div className="mt-4">
              <ConversationList
                conversations={conversations}
                unreadByConversation={unreadByConversation}
                activeConversationId={activeConversation?.id}
                onSelect={openConversation}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)] lg:h-[36rem]">
              {activeConversation ? (
                <MessageThread
                  conversation={activeConversation}
                  messages={activeMessages}
                  typing={activeTyping}
                  currentUserId={CURRENT_USER}
                  onSend={send}
                  onAddReaction={reactToMessage}
                  onRemoveReaction={unreact}
                  onToggleStar={toggleStarOnMessage}
                  onTogglePin={(messageId) => {
                    const pinned = activeConversation.pinnedMessageIds.includes(messageId);
                    if (pinned) {
                      unpinMessageById(activeConversation.id, messageId);
                    } else {
                      pinMessageById(activeConversation.id, messageId);
                    }
                  }}
                  onDelete={deleteMessageById}
                  starredMessageIds={starredMessageIds}
                  aiSuggestion={featuredSummary?.suggestedReply}
                  canSend={canSend(activeConversation.id)}
                />
              ) : (
                <p className="py-20 text-center text-sm text-slate-400">Select a conversation to start reading and replying.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

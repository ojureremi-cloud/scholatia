'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useState } from 'react';
import { allCommunityMembers, designatedCommunityMembers } from '@/lib/communities';
import { formatDate, formatMemberStatus, formatRole, formatRoleIcon, memberStatusVariant, roleVariant } from './format';
import type { Community, CommunityRole } from '@/types/communities';
import { COMMUNITY_ROLES } from '@/types/communities';

type CommunityMembersProps = {
  community: Community;
  currentUser: string;
  onInvite?: (username: string, name: string, role: CommunityRole) => void;
  onEject?: (username: string) => void;
  onChangeRole?: (username: string, role: CommunityRole) => void;
};

export function CommunityMembers({
  community,
  currentUser,
  onInvite,
  onEject,
  onChangeRole,
}: CommunityMembersProps) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<CommunityRole>('member');

  const members = allCommunityMembers(community).filter((member) => member.status !== 'removed');
  const designated = designatedCommunityMembers(community);

  return (
    <div className="space-y-6">
      {onInvite && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Invite a member</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="canonical username (e.g. dube)"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="display name"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <Select
              label=""
              options={COMMUNITY_ROLES.filter((value) => value !== 'owner').map((value) => ({
                label: formatRole(value),
                value,
              }))}
              value={role}
              onChange={(event) => setRole(event.target.value as CommunityRole)}
            />
            <Button
              size="sm"
              onClick={() => {
                if (!username.trim()) return;
                onInvite(username.trim(), name.trim() || username.trim(), role);
                setUsername('');
                setName('');
              }}
            >
              Invite
            </Button>
          </div>
        </div>
      )}

      {members.length === 0 ? (
        <p className="text-sm text-slate-400">No active members in this community yet.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.username}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <Avatar name={member.name} imageUrl={member.avatar} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {member.name}
                  {member.username === currentUser && (
                    <span className="ml-2 text-xs font-medium text-sky-600 dark:text-sky-400">(you)</span>
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  @{member.username} · joined {formatDate(member.joinedAt)} ·{' '}
                  {formatMemberStatus(member.status)}
                </p>
              </div>
              <Badge variant={roleVariant(member.role)}>
                {formatRoleIcon(member.role)} {formatRole(member.role)}
              </Badge>
              <Badge variant={memberStatusVariant(member.status)}>{member.status}</Badge>
              {onChangeRole && member.username !== community.creator && (
                <Select
                  label=""
                  className="w-36"
                  options={COMMUNITY_ROLES.filter((value) => value !== 'owner').map((value) => ({
                    label: formatRole(value),
                    value,
                  }))}
                  value={member.role}
                  onChange={(event) => onChangeRole(member.username, event.target.value as CommunityRole)}
                />
              )}
              {onEject && member.username !== community.creator && (
                <Button size="sm" variant="outline" onClick={() => onEject(member.username)}>
                  Eject
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {designated.length > 0 && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Designated seats ({designated.length})
          </h4>
          <ul className="mt-3 space-y-2">
            {designated.map((person) => (
              <li key={person.username} className="flex items-center gap-3 text-sm">
                <Avatar name={person.name} imageUrl={person.avatar} size="sm" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{person.name}</span>
                <span className="text-xs text-slate-400">@{person.username}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {members.length > 0 && (
        <p className="text-xs text-slate-400">
          {members.length} member{members.length === 1 ? '' : 's'} · creator @{community.creator} ·{' '}
          {community.followerCount} follower{community.followerCount === 1 ? '' : 's'}
        </p>
      )}
    </div>
  );
}

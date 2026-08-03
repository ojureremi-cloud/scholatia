'use client';

import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useState } from 'react';
import { formatDate, formatRole, formatRoleIcon, roleVariant } from './format';
import { activeGroupMembers } from '@/lib/groups';
import type { Group, GroupRole } from '@/types/groups';
import { GROUP_ROLES } from '@/types/groups';

type GroupMembersProps = {
  group: Group;
  currentUser: string;
  onInvite?: (username: string, name: string, role: GroupRole) => void;
  onEject?: (username: string) => void;
  onChangeRole?: (username: string, role: GroupRole) => void;
};

export function GroupMembers({ group, currentUser, onInvite, onEject, onChangeRole }: GroupMembersProps) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<GroupRole>('member');

  const members = activeGroupMembers(group);

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
              options={GROUP_ROLES.filter((value) => value !== 'owner').map((value) => ({
                label: formatRole(value),
                value,
              }))}
              value={role}
              onChange={(event) => setRole(event.target.value as GroupRole)}
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
        <p className="text-sm text-slate-400">No active members in this group yet.</p>
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
                  @{member.username} · joined {formatDate(member.joinedAt)} · {member.status}
                </p>
              </div>
              <Badge variant={roleVariant(member.role)}>
                {formatRoleIcon(member.role)} {formatRole(member.role)}
              </Badge>
              {onChangeRole && member.username !== group.owner && (
                <Select
                  label=""
                  className="w-36"
                  options={GROUP_ROLES.filter((value) => value !== 'owner').map((value) => ({
                    label: formatRole(value),
                    value,
                  }))}
                  value={member.role}
                  onChange={(event) => onChangeRole(member.username, event.target.value as GroupRole)}
                />
              )}
              {onEject && member.username !== group.owner && (
                <Button size="sm" variant="outline" onClick={() => onEject(member.username)}>
                  Eject
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {members.length > 0 && (
        <p className="text-xs text-slate-400">
          {members.length} active member{members.length === 1 ? '' : 's'} · owner @{group.owner}
        </p>
      )}
    </div>
  );
}

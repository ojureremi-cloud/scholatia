'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  CURRENT_GROUPS_USER,
  FEATURED_GROUPS,
  GROUP_ANALYTICS,
  GROUP_COUNTRIES,
  GROUP_DISCIPLINES,
  GROUP_INSIGHTS,
  GROUP_PORTFOLIO,
  GROUP_STATISTICS,
  GROUPS,
} from '@/constants/placeholder-groups';
import {
  addGroupMember,
  canInviteToGroup,
  canManageGroup,
  canModerateGroup,
  canPostToGroup,
  canViewGroup,
  changeGroupMemberRole,
  createGroup,
  filterGroups,
  groupId,
  groupMemberRoleOf,
  groupsForUser,
  removeGroupMember,
  searchGroups,
  sortGroups,
} from '@/lib/groups';
import type {
  Group,
  GroupCategory,
  GroupFilter,
  GroupRole,
  GroupSort,
  GroupVisibility,
} from '@/types/groups';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useGroups() {
  const [groups, setGroups] = useState(GROUPS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | GroupCategory>('all');
  const [visibility, setVisibility] = useState<'all' | GroupVisibility>('all');
  const [country, setCountry] = useState<'all' | string>('all');
  const [discipline, setDiscipline] = useState<'all' | string>('all');
  const [sort, setSort] = useState<GroupSort>('recent');

  const viewer = useMemo(() => ({ username: CURRENT_GROUPS_USER, name: CURRENT_USER_NAME }), []);

  const visible = useMemo(
    () => groups.filter((group) => canViewGroup(group, viewer.username)),
    [groups, viewer],
  );

  const filtered = useMemo(() => {
    const filter: GroupFilter = {
      category: category === 'all' ? undefined : category,
      visibility: visibility === 'all' ? undefined : visibility,
      country: country === 'all' ? undefined : country,
      discipline: discipline === 'all' ? undefined : discipline,
    };
    return sortGroups(filterGroups(visible, filter), sort);
  }, [visible, category, visibility, country, discipline, sort]);

  const searchResults = useMemo(() => (query.trim() ? searchGroups(visible, query) : []), [query, visible]);

  const myGroups = useMemo(() => groupsForUser(visible, viewer.username), [visible, viewer]);

  const portfolio = useMemo(() => GROUP_PORTFOLIO, []);
  const statistics = useMemo(() => GROUP_STATISTICS, []);
  const analytics = useMemo(() => GROUP_ANALYTICS, []);
  const insights = useMemo(() => GROUP_INSIGHTS, []);
  const featured = useMemo(() => FEATURED_GROUPS, []);
  const countries = useMemo(() => GROUP_COUNTRIES, []);
  const disciplines = useMemo(() => GROUP_DISCIPLINES, []);

  const roleOf = useCallback(
    (groupIdValue: string): GroupRole | undefined => {
      const group = visible.find((entry) => entry.id === groupIdValue);
      return group ? groupMemberRoleOf(group, viewer.username) : undefined;
    },
    [visible, viewer],
  );

  const isMember = useCallback(
    (group: Group) => groupMemberRoleOf(group, viewer.username) !== undefined,
    [viewer],
  );

  const canManage = useCallback((group: Group) => canManageGroup(group, viewer.username), [viewer]);
  const canModerate = useCallback((group: Group) => canModerateGroup(group, viewer.username), [viewer]);
  const canPost = useCallback((group: Group) => canPostToGroup(group, viewer.username), [viewer]);
  const canInvite = useCallback((group: Group) => canInviteToGroup(group, viewer.username), [viewer]);

  const inviteMemberTo = useCallback(
    (groupIdValue: string, username: string, name: string, role: GroupRole) => {
      setGroups((current) =>
        current.map((group) =>
          group.id === groupIdValue ? addGroupMember(group, { username, name, role }) : group,
        ),
      );
    },
    [],
  );

  const ejectMemberFrom = useCallback((groupIdValue: string, username: string) => {
    setGroups((current) =>
      current.map((group) => (group.id === groupIdValue ? removeGroupMember(group, username) : group)),
    );
  }, []);

  const changeRoleOfMember = useCallback((groupIdValue: string, username: string, role: GroupRole) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupIdValue ? changeGroupMemberRole(group, username, role) : group,
      ),
    );
  }, []);

  const createNewGroup = useCallback(
    (input: {
      name: string;
      category: GroupCategory;
      description?: string;
      visibility?: GroupVisibility;
      institution?: string;
      institutionId?: string;
      department?: string;
      country?: string;
      discipline?: string;
      researchAreas?: string[];
      keywords?: string[];
    }) => {
      const created = createGroup({
        id: groupId(input.name),
        name: input.name,
        category: input.category,
        description: input.description,
        visibility: input.visibility,
        owner: viewer.username,
        ownerName: viewer.name,
        institution: input.institution,
        institutionId: input.institutionId,
        department: input.department,
        country: input.country,
        discipline: input.discipline,
        researchAreas: input.researchAreas,
        keywords: input.keywords,
      });
      setGroups((current) => [created, ...current]);
      return created;
    },
    [viewer],
  );

  return useMemo(
    () => ({
      groups,
      visible,
      filtered,
      searchResults,
      myGroups,
      statistics,
      analytics,
      insights,
      featured,
      portfolio,
      countries,
      disciplines,
      query,
      setQuery,
      category,
      setCategory,
      visibility,
      setVisibility,
      country,
      setCountry,
      discipline,
      setDiscipline,
      sort,
      setSort,
      currentUser: CURRENT_GROUPS_USER,
      currentUserName: CURRENT_USER_NAME,
      roleOf,
      isMember,
      canManage,
      canModerate,
      canPost,
      canInvite,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      createNewGroup,
    }),
    [
      groups,
      visible,
      filtered,
      searchResults,
      myGroups,
      statistics,
      analytics,
      insights,
      featured,
      portfolio,
      countries,
      disciplines,
      query,
      category,
      visibility,
      country,
      discipline,
      sort,
      roleOf,
      isMember,
      canManage,
      canModerate,
      canPost,
      canInvite,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      createNewGroup,
    ],
  );
}

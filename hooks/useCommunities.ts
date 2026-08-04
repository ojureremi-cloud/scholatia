'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  COMMUNITIES,
  COMMUNITY_ANALYTICS,
  COMMUNITY_COUNTRIES,
  COMMUNITY_DISCIPLINES,
  COMMUNITY_INSIGHTS,
  COMMUNITY_KEYWORDS,
  COMMUNITY_LANGUAGES,
  COMMUNITY_PORTFOLIO,
  COMMUNITY_RESEARCH_AREAS,
  COMMUNITY_STATISTICS,
  CURRENT_COMMUNITIES_USER,
  FEATURED_COMMUNITIES,
  TRENDING_COMMUNITIES,
} from '@/constants/placeholder-communities';
import {
  addCommunityMember,
  canInviteToCommunity,
  canManageCommunity,
  canModerateCommunity,
  canPostToCommunity,
  canViewCommunity,
  changeCommunityMemberRole,
  communitiesForUser,
  communityMemberRoleOf,
  createCommunity,
  communityId,
  communityUrl,
  filterCommunities,
  followCommunity,
  isCommunityFollower,
  removeCommunityMember,
  searchCommunities,
  sortCommunities,
  unfollowCommunity,
} from '@/lib/communities';
import type {
  Community,
  CommunityCategory,
  CommunityFilter,
  CommunityRole,
  CommunitySort,
  CommunityVisibility,
} from '@/types/communities';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useCommunities() {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | CommunityCategory>('all');
  const [visibility, setVisibility] = useState<'all' | CommunityVisibility>('all');
  const [country, setCountry] = useState<'all' | string>('all');
  const [language, setLanguage] = useState<'all' | string>('all');
  const [discipline, setDiscipline] = useState<'all' | string>('all');
  const [sort, setSort] = useState<CommunitySort>('activity');

  const viewer = useMemo(() => ({ username: CURRENT_COMMUNITIES_USER, name: CURRENT_USER_NAME }), []);

  const visible = useMemo(
    () => communities.filter((community) => canViewCommunity(community, viewer.username)),
    [communities, viewer],
  );

  const filtered = useMemo(() => {
    const filter: CommunityFilter = {
      category: category === 'all' ? undefined : category,
      visibility: visibility === 'all' ? undefined : visibility,
      country: country === 'all' ? undefined : country,
      language: language === 'all' ? undefined : language,
      discipline: discipline === 'all' ? undefined : discipline,
    };
    return sortCommunities(filterCommunities(visible, filter), sort);
  }, [visible, category, visibility, country, language, discipline, sort]);

  const searchResults = useMemo(
    () => (query.trim() ? searchCommunities(visible, query) : []),
    [query, visible],
  );

  const myCommunities = useMemo(
    () => communitiesForUser(visible, viewer.username),
    [visible, viewer],
  );

  const portfolio = useMemo(() => COMMUNITY_PORTFOLIO, []);
  const statistics = useMemo(() => COMMUNITY_STATISTICS, []);
  const analytics = useMemo(() => COMMUNITY_ANALYTICS, []);
  const insights = useMemo(() => COMMUNITY_INSIGHTS, []);
  const featured = useMemo(() => FEATURED_COMMUNITIES, []);
  const trending = useMemo(() => TRENDING_COMMUNITIES, []);
  const countries = useMemo(() => COMMUNITY_COUNTRIES, []);
  const languages = useMemo(() => COMMUNITY_LANGUAGES, []);
  const disciplines = useMemo(() => COMMUNITY_DISCIPLINES, []);
  const researchAreas = useMemo(() => COMMUNITY_RESEARCH_AREAS, []);
  const keywords = useMemo(() => COMMUNITY_KEYWORDS, []);

  const roleOf = useCallback(
    (communityIdValue: string): CommunityRole | undefined => {
      const community = visible.find((entry) => entry.id === communityIdValue);
      return community ? communityMemberRoleOf(community, viewer.username) : undefined;
    },
    [visible, viewer],
  );

  const isMember = useCallback(
    (community: Community) => communityMemberRoleOf(community, viewer.username) !== undefined,
    [viewer],
  );

  const isFollowing = useCallback(
    (community: Community) => isCommunityFollower(community, viewer.username),
    [viewer],
  );

  const canManage = useCallback((community: Community) => canManageCommunity(community, viewer.username), [viewer]);
  const canModerate = useCallback((community: Community) => canModerateCommunity(community, viewer.username), [viewer]);
  const canPost = useCallback((community: Community) => canPostToCommunity(community, viewer.username), [viewer]);
  const canInvite = useCallback((community: Community) => canInviteToCommunity(community, viewer.username), [viewer]);

  const joinCommunity = useCallback(
    (communityIdValue: string) => {
      setCommunities((current) =>
        current.map((community) =>
          community.id === communityIdValue
            ? addCommunityMember(community, { username: viewer.username, name: viewer.name, role: 'member' })
            : community,
        ),
      );
    },
    [viewer],
  );

  const leaveCommunity = useCallback((communityIdValue: string) => {
    setCommunities((current) =>
      current.map((community) =>
        community.id === communityIdValue ? removeCommunityMember(community, CURRENT_COMMUNITIES_USER) : community,
      ),
    );
  }, []);

  const inviteMemberTo = useCallback(
    (communityIdValue: string, username: string, name: string, role: CommunityRole) => {
      setCommunities((current) =>
        current.map((community) =>
          community.id === communityIdValue ? addCommunityMember(community, { username, name, role }) : community,
        ),
      );
    },
    [],
  );

  const ejectMemberFrom = useCallback((communityIdValue: string, username: string) => {
    setCommunities((current) =>
      current.map((community) =>
        community.id === communityIdValue ? removeCommunityMember(community, username) : community,
      ),
    );
  }, []);

  const changeRoleOfMember = useCallback((communityIdValue: string, username: string, role: CommunityRole) => {
    setCommunities((current) =>
      current.map((community) =>
        community.id === communityIdValue ? changeCommunityMemberRole(community, username, role) : community,
      ),
    );
  }, []);

  const toggleFollow = useCallback((communityIdValue: string) => {
    setCommunities((current) =>
      current.map((community) => {
        if (community.id !== communityIdValue) return community;
        return isCommunityFollower(community, CURRENT_COMMUNITIES_USER)
          ? unfollowCommunity(community, CURRENT_COMMUNITIES_USER)
          : followCommunity(community, {
              username: CURRENT_COMMUNITIES_USER,
              name: CURRENT_USER_NAME,
            });
      }),
    );
  }, []);

  const createNewCommunity = useCallback(
    (input: {
      name: string;
      category: CommunityCategory;
      description?: string;
      visibility?: CommunityVisibility;
      discipline?: string;
      researchAreas?: string[];
      keywords?: string[];
      language?: string;
      country?: string;
      region?: string;
    }) => {
      const created = createCommunity({
        id: communityId(input.name),
        name: input.name,
        category: input.category,
        description: input.description,
        visibility: input.visibility,
        discipline: input.discipline,
        researchAreas: input.researchAreas,
        keywords: input.keywords,
        language: input.language,
        country: input.country,
        region: input.region,
        creator: viewer.username,
        creatorName: viewer.name,
      });
      setCommunities((current) => [created, ...current]);
      return created;
    },
    [viewer],
  );

  const recommendations = useMemo(() => {
    if (portfolio.recommendations.length > 0) return portfolio.recommendations;
    return [];
  }, [portfolio]);

  return useMemo(
    () => ({
      communities,
      visible,
      filtered,
      searchResults,
      myCommunities,
      statistics,
      analytics,
      insights,
      featured,
      trending,
      portfolio,
      recommendations,
      countries,
      languages,
      disciplines,
      researchAreas,
      keywords,
      query,
      setQuery,
      category,
      setCategory,
      visibility,
      setVisibility,
      country,
      setCountry,
      language,
      setLanguage,
      discipline,
      setDiscipline,
      sort,
      setSort,
      currentUser: CURRENT_COMMUNITIES_USER,
      currentUserName: CURRENT_USER_NAME,
      roleOf,
      isMember,
      isFollowing,
      canManage,
      canModerate,
      canPost,
      canInvite,
      joinCommunity,
      leaveCommunity,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      toggleFollow,
      createNewCommunity,
      communityUrl,
    }),
    [
      communities,
      visible,
      filtered,
      searchResults,
      myCommunities,
      statistics,
      analytics,
      insights,
      featured,
      trending,
      portfolio,
      recommendations,
      countries,
      languages,
      disciplines,
      researchAreas,
      keywords,
      query,
      category,
      visibility,
      country,
      language,
      discipline,
      sort,
      roleOf,
      isMember,
      isFollowing,
      canManage,
      canModerate,
      canPost,
      canInvite,
      joinCommunity,
      leaveCommunity,
      inviteMemberTo,
      ejectMemberFrom,
      changeRoleOfMember,
      toggleFollow,
      createNewCommunity,
    ],
  );
}

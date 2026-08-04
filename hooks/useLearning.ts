'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  CURRENT_LEARNING_USER,
  CURRENT_LEARNING_USER_NAME,
  LEARNING_ACADEMIES,
  LEARNING_ANALYTICS,
  LEARNING_ASSESSMENTS,
  LEARNING_CATEGORIES,
  LEARNING_COMPETENCY_ATTAINMENT,
  LEARNING_COMPETENCY_EVIDENCE,
  LEARNING_COMPETENCY_GAPS,
  LEARNING_COURSES,
  LEARNING_EVENTS,
  LEARNING_GAP_RECOMMENDATIONS,
  LEARNING_GOALS,
  LEARNING_KPIS,
  LEARNING_MENTORS,
  LEARNING_MENTORSHIPS,
  LEARNING_PASSPORT,
  LEARNING_PATHS,
  LEARNING_PORTFOLIOS,
  LEARNING_PROGRAMMES,
  LEARNING_PROGRESS,
  LEARNING_RECOMMENDATIONS,
  LEARNING_RECOMMENDED_MENTORS,
  LEARNING_STATISTICS,
  SLE_COMPETENCY_FRAMEWORK,
} from '@/constants/placeholder-learning';
import {
  addPortfolioItem,
  advanceProgress,
  completeLearningObject,
  courseProgress,
  filterCourses,
  requestMentorship,
  revokePortfolioShare,
  searchCourses,
  sharePortfolioItem,
  sortCourses,
  updateGoalStatus,
  updateMentorshipStatus,
} from '@/lib/learning';
import { learnerAnalytics } from '@/lib/learning-analytics';
import { learningNotificationSummary, notificationsFromWorkflow } from '@/lib/learning-notifications';
import { updatePortfolio as updatePortfolioEntry } from '@/lib/learning-portfolio';
import { recommendCourses as recommendCoursesEngine, recommendMentorsFor } from '@/lib/learning-recommendations';
import {
  awardBadgeFor,
  completeObjectInCourse,
  enrol as enrolInCourse,
  issueCertificateFor,
  recordCpdFor,
  withdraw as withdrawFromCourse,
} from '@/lib/learning-workflows';
import type {
  AnalyticsScope,
  CompetencyDomain,
  CourseKind,
  GoalStatus,
  LearningCourse,
  LearningFilter,
  LearningMentor,
  LearningNodeType,
  LearningPassport,
  LearningPortfolio,
  LearningProgressEntry,
  LearningRecommendationOptions,
  LearningSort,
  LearningWorkflowEvent,
  MentorshipStatus,
  PortfolioItem,
  PortfolioItemVisibility,
  ProgressState,
} from '@/types/learning';

export default function useLearning() {
  const courses = LEARNING_COURSES;
  const programmes = LEARNING_PROGRAMMES;
  const paths = LEARNING_PATHS;
  const [portfolios, setPortfolios] = useState(LEARNING_PORTFOLIOS);
  const [mentorships, setMentorships] = useState(LEARNING_MENTORSHIPS);
  const [goals, setGoals] = useState(LEARNING_GOALS);
  const [progress, setProgress] = useState<LearningProgressEntry[]>(LEARNING_PROGRESS);
  const [recommendations, setRecommendations] = useState(LEARNING_RECOMMENDATIONS);
  const [passport, setPassport] = useState<LearningPassport>(LEARNING_PASSPORT);
  const [workflowEvents, setWorkflowEvents] = useState<LearningWorkflowEvent[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | string>('all');
  const [courseKind, setCourseKind] = useState<'all' | CourseKind>('all');
  const [domain, setDomain] = useState<'all' | CompetencyDomain>('all');
  const [sort, setSort] = useState<LearningSort>('recent');
  const [scope, setScope] = useState<AnalyticsScope>('learner');

  const learner = useMemo(() => ({ username: CURRENT_LEARNING_USER, name: CURRENT_LEARNING_USER_NAME }), []);

  const filtered = useMemo(() => {
    const filter: LearningFilter = {
      category: category === 'all' ? undefined : category,
      courseKind: courseKind === 'all' ? undefined : courseKind,
      status: 'published',
    };
    return sortCourses(filterCourses(courses, filter), sort, progress);
  }, [courses, category, courseKind, sort, progress]);

  const searchResults = useMemo(() => (query.trim() ? searchCourses(courses, query) : []), [query, courses]);

  const myPaths = useMemo(() => paths.filter((path) => path.ownerUsername === learner.username), [paths, learner]);

  const statistics = useMemo(() => LEARNING_STATISTICS, []);
  const kpis = useMemo(() => LEARNING_KPIS, []);
  const analytics = useMemo(() => LEARNING_ANALYTICS, []);
  const mentors = useMemo(() => LEARNING_MENTORS, []);
  const recommendedMentors = useMemo(() => LEARNING_RECOMMENDED_MENTORS, []);
  const academies = useMemo(() => LEARNING_ACADEMIES, []);
  const events = useMemo(() => LEARNING_EVENTS, []);
  const categories = useMemo(() => LEARNING_CATEGORIES, []);
  const competencyGaps = useMemo(() => LEARNING_COMPETENCY_GAPS, []);
  const competencyAttainment = useMemo(() => LEARNING_COMPETENCY_ATTAINMENT, []);
  const evidenceLevels = useMemo(() => LEARNING_COMPETENCY_EVIDENCE, []);
  const gapRecommendations = useMemo(() => LEARNING_GAP_RECOMMENDATIONS, []);

  const progressOf = useCallback((course: LearningCourse) => courseProgress(progress, course), [progress]);

  const applyWorkflow = useCallback(
    (result: { state: LearningProgressEntry[]; events: LearningWorkflowEvent[] }) => {
      setProgress(result.state);
      setWorkflowEvents((current) => [...result.events, ...current]);
    },
    [],
  );

  const applyPassportWorkflow = useCallback(
    (result: { state: LearningPassport; events: LearningWorkflowEvent[] }) => {
      setPassport(result.state);
      setWorkflowEvents((current) => [...result.events, ...current]);
    },
    [],
  );

  const enrol = useCallback(
    (courseIdValue: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyWorkflow(enrolInCourse(progress, course, learner.username));
    },
    [courses, progress, learner, applyWorkflow],
  );

  const setCourseState = useCallback((courseIdValue: string, state: ProgressState) => {
    setProgress((current) => advanceProgress(current, { nodeType: 'course', learningObjectId: courseIdValue, state }));
  }, []);

  const completeObject = useCallback((nodeType: LearningNodeType, learningObjectId: string, score?: number) => {
    setProgress((current) =>
      completeLearningObject(current, nodeType, learningObjectId, new Date().toISOString(), score),
    );
  }, []);

  const applyRecommendation = useCallback((recommendationIdValue: string) => {
    setRecommendations((current) =>
      current.map((recommendation) =>
        recommendation.id === recommendationIdValue ? { ...recommendation, applied: true } : recommendation,
      ),
    );
  }, []);

  const dismissRecommendation = useCallback((recommendationIdValue: string) => {
    setRecommendations((current) => current.filter((recommendation) => recommendation.id !== recommendationIdValue));
  }, []);

  const requestMentorshipFor = useCallback(
    (mentor: LearningMentor) => {
      setMentorships((current) => [
        requestMentorship({
          mentor,
          menteeUsername: learner.username,
          menteeName: learner.name,
          kind: mentor.kind,
        }),
        ...current,
      ]);
    },
    [learner],
  );

  const updateMentorshipStatusOf = useCallback((mentorshipIdValue: string, status: MentorshipStatus) => {
    setMentorships((current) =>
      current.map((mentorship) => (mentorship.id === mentorshipIdValue ? updateMentorshipStatus(mentorship, status) : mentorship)),
    );
  }, []);

  const setGoalStatusOf = useCallback((goalIdValue: string, status: GoalStatus) => {
    setGoals((current) => current.map((goal) => (goal.id === goalIdValue ? updateGoalStatus(goal, status) : goal)));
  }, []);

  const addItemToPortfolio = useCallback(
    (kind: LearningPortfolio['kind'], item: PortfolioItem) => {
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === kind
            ? addPortfolioItem(portfolio, item)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const shareItemInPortfolio = useCallback(
    (kind: LearningPortfolio['kind'], itemId: string, visibility: PortfolioItemVisibility = 'shared') => {
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === kind
            ? sharePortfolioItem(portfolio, itemId, visibility)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const revokeItemShareInPortfolio = useCallback((kind: LearningPortfolio['kind'], itemId: string) => {
    setPortfolios((current) =>
      current.map((portfolio) =>
        portfolio.learnerUsername === CURRENT_LEARNING_USER && portfolio.kind === kind
          ? revokePortfolioShare(portfolio, itemId)
          : portfolio,
      ),
    );
  }, []);

  const withdraw = useCallback(
    (courseIdValue: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyWorkflow(withdrawFromCourse(progress, course, learner.username));
    },
    [courses, progress, learner, applyWorkflow],
  );

  const completeLesson = useCallback(
    (courseIdValue: string, lessonIdValue: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyWorkflow(completeObjectInCourse(progress, course, lessonIdValue, learner.username));
    },
    [courses, progress, learner, applyWorkflow],
  );

  const completeModule = useCallback(
    (courseIdValue: string, moduleIdValue: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyWorkflow(completeObjectInCourse(progress, course, moduleIdValue, learner.username));
    },
    [courses, progress, learner, applyWorkflow],
  );

  const completeCourse = useCallback(
    (courseIdValue: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyWorkflow(completeObjectInCourse(progress, course, courseIdValue, learner.username));
    },
    [courses, progress, learner, applyWorkflow],
  );

  const issueCertificate = useCallback(
    (courseIdValue: string, title?: string) => {
      const course = courses.find((item) => item.id === courseIdValue);
      if (!course) return;
      applyPassportWorkflow(
        issueCertificateFor(progress, passport, course, {
          title: title ?? `${course.title} — Certificate`,
          issuerUsername: CURRENT_LEARNING_USER,
          issuerName: CURRENT_LEARNING_USER_NAME,
          learnerUsername: learner.username,
          learnerName: learner.name,
        }),
      );
    },
    [courses, progress, passport, learner, applyPassportWorkflow],
  );

  const awardBadge = useCallback(
    (input: { title: string; competencyKey?: string; imageUrl?: string; standard?: string }) => {
      applyPassportWorkflow(
        awardBadgeFor(passport, {
          title: input.title,
          issuerUsername: CURRENT_LEARNING_USER,
          issuerName: CURRENT_LEARNING_USER_NAME,
          learnerUsername: learner.username,
          learnerName: learner.name,
          competencyKey: input.competencyKey,
          imageUrl: input.imageUrl ?? '',
          standard: input.standard,
        }),
      );
    },
    [passport, learner, applyPassportWorkflow],
  );

  const recordCPD = useCallback(
    (input: { activityTitle: string; hours: number; activityDate?: string; title?: string }) => {
      applyPassportWorkflow(
        recordCpdFor(passport, {
          title: input.title ?? input.activityTitle,
          activityTitle: input.activityTitle,
          hours: input.hours,
          activityDate: input.activityDate ?? new Date().toISOString().slice(0, 10),
        }),
      );
    },
    [passport, applyPassportWorkflow],
  );

  const updatePortfolio = useCallback(
    (item: PortfolioItem, kind?: LearningPortfolio['kind']) => {
      const portfolioKind = kind ?? item.kind;
      setPortfolios((current) =>
        current.map((portfolio) =>
          portfolio.learnerUsername === learner.username && portfolio.kind === portfolioKind
            ? updatePortfolioEntry(portfolio, item)
            : portfolio,
        ),
      );
    },
    [learner],
  );

  const recommendCourses = useCallback(
    (options: LearningRecommendationOptions = {}) =>
      recommendCoursesEngine(
        {
          learnerUsername: learner.username,
          courses,
          progress,
          goals,
          framework: SLE_COMPETENCY_FRAMEWORK,
          evidenceLevels,
          mentors,
        },
        options,
      ),
    [courses, progress, goals, evidenceLevels, mentors, learner],
  );

  const recommendMentors = useCallback(
    (options: LearningRecommendationOptions = {}) =>
      recommendMentorsFor(
        {
          learnerUsername: learner.username,
          courses,
          progress,
          goals,
          framework: SLE_COMPETENCY_FRAMEWORK,
          evidenceLevels,
          mentors,
        },
        options,
      ),
    [courses, progress, goals, evidenceLevels, mentors, learner],
  );

  const trackProgress = useCallback(
    (courseIdValue?: string) =>
      courseIdValue ? progress.filter((entry) => entry.learningObjectId === courseIdValue) : progress,
    [progress],
  );

  const calculateAnalytics = useCallback(
    () =>
      learnerAnalytics({
        learnerUsername: learner.username,
        courses,
        progress,
        assessments: LEARNING_ASSESSMENTS,
        framework: SLE_COMPETENCY_FRAMEWORK,
        evidenceLevels,
        portfolios,
        cpdRecords: passport.cpdRecords,
        goals,
        mentorships,
      }),
    [courses, progress, evidenceLevels, portfolios, passport, goals, mentorships, learner],
  );

  const notifications = useMemo(() => notificationsFromWorkflow(workflowEvents), [workflowEvents]);

  const notificationSummary = useMemo(() => learningNotificationSummary(notifications), [notifications]);

  return useMemo(
    () => ({
      courses,
      programmes,
      paths,
      myPaths,
      portfolios,
      mentorships,
      goals,
      progress,
      recommendations,
      gapRecommendations,
      filtered,
      searchResults,
      statistics,
      kpis,
      analytics,
      mentors,
      recommendedMentors,
      academies,
      events,
      passport,
      workflowEvents,
      notifications,
      notificationSummary,
      categories,
      competencyGaps,
      competencyAttainment,
      evidenceLevels,
      query,
      setQuery,
      category,
      setCategory,
      courseKind,
      setCourseKind,
      domain,
      setDomain,
      sort,
      setSort,
      scope,
      setScope,
      currentUser: CURRENT_LEARNING_USER,
      currentUserName: CURRENT_LEARNING_USER_NAME,
      progressOf,
      enrol,
      setCourseState,
      completeObject,
      applyRecommendation,
      dismissRecommendation,
      requestMentorshipFor,
      updateMentorshipStatusOf,
      setGoalStatusOf,
      addItemToPortfolio,
      shareItemInPortfolio,
      revokeItemShareInPortfolio,
      withdraw,
      completeLesson,
      completeModule,
      completeCourse,
      issueCertificate,
      awardBadge,
      recordCPD,
      updatePortfolio,
      recommendCourses,
      recommendMentors,
      trackProgress,
      calculateAnalytics,
    }),
    [
      courses,
      programmes,
      paths,
      myPaths,
      portfolios,
      mentorships,
      goals,
      progress,
      recommendations,
      gapRecommendations,
      filtered,
      searchResults,
      statistics,
      kpis,
      analytics,
      mentors,
      recommendedMentors,
      academies,
      events,
      passport,
      workflowEvents,
      notifications,
      notificationSummary,
      categories,
      competencyGaps,
      competencyAttainment,
      evidenceLevels,
      query,
      category,
      courseKind,
      domain,
      sort,
      scope,
      progressOf,
      enrol,
      setCourseState,
      completeObject,
      applyRecommendation,
      dismissRecommendation,
      requestMentorshipFor,
      updateMentorshipStatusOf,
      setGoalStatusOf,
      addItemToPortfolio,
      shareItemInPortfolio,
      revokeItemShareInPortfolio,
      withdraw,
      completeLesson,
      completeModule,
      completeCourse,
      issueCertificate,
      awardBadge,
      recordCPD,
      updatePortfolio,
      recommendCourses,
      recommendMentors,
      trackProgress,
      calculateAnalytics,
    ],
  );
}

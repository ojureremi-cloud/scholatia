'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  CURRENT_WORKFLOW_USER,
  DEFAULT_WORKFLOW,
  DEFAULT_WORKFLOW_KIND,
  FEATURED_WORKFLOWS,
  WORKFLOW_ANALYTICS,
  WORKFLOW_INSIGHTS,
  WORKFLOW_INSTANCES,
  WORKFLOW_PORTFOLIO,
  WORKFLOW_STATISTICS,
  WORKFLOW_TEMPLATES,
} from '@/constants/placeholder-workflows';
import {
  approveWorkflow,
  completeWorkflow,
  createWorkflowFromTemplate,
  currentStage,
  filterWorkflows,
  requestWorkflowRevision,
  searchWorkflows,
  sortWorkflows,
  submitWorkflowForReview,
  submitWorkflowRevision,
  workflowProgress,
  workflowsAwaiting,
  workflowsForUser,
} from '@/lib/workflows';
import type {
  WorkflowFilter,
  WorkflowInstance,
  WorkflowPriority,
  WorkflowSort,
  WorkflowStage,
  WorkflowStatus,
  WorkflowTemplate,
  WorkflowTemplateKind,
} from '@/types/workflows';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useWorkflow() {
  const [workflows, setWorkflows] = useState(WORKFLOW_INSTANCES);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | WorkflowTemplateKind>('all');
  const [status, setStatus] = useState<'all' | WorkflowStatus>('all');
  const [sort, setSort] = useState<WorkflowSort>('recent');

  const filtered = useMemo(() => {
    const filter: WorkflowFilter = {
      kind: kind === 'all' ? undefined : kind,
      status: status === 'all' ? undefined : status,
    };
    return sortWorkflows(filterWorkflows(workflows, filter), sort);
  }, [workflows, kind, status, sort]);

  const searchResults = useMemo(() => (query.trim() ? searchWorkflows(workflows, query) : []), [query, workflows]);

  const myWorkflows = useMemo(() => workflowsForUser(workflows, CURRENT_WORKFLOW_USER), [workflows]);
  const awaiting = useMemo(() => workflowsAwaiting(workflows, CURRENT_WORKFLOW_USER), [workflows]);

  const statistics = useMemo(() => WORKFLOW_STATISTICS, []);
  const analytics = useMemo(() => WORKFLOW_ANALYTICS, []);
  const insights = useMemo(() => WORKFLOW_INSIGHTS, []);
  const portfolio = useMemo(() => WORKFLOW_PORTFOLIO, []);
  const featured = useMemo(() => FEATURED_WORKFLOWS, []);

  const workflowById = useCallback(
    (id: string) => workflows.find((workflow) => workflow.id === id),
    [workflows],
  );

  const stageOf = useCallback(
    (id: string) => {
      const workflow = workflowById(id);
      return workflow ? currentStage(workflow) : undefined;
    },
    [workflowById],
  );

  const progressOf = useCallback(
    (id: string) => {
      const workflow = workflowById(id);
      return workflow ? Math.round(workflowProgress(workflow) * 100) : 0;
    },
    [workflowById],
  );

  const createFromTemplate = useCallback(
    (template: WorkflowTemplate, options: { title?: string; description?: string; priority?: WorkflowPriority; sourceId?: string; sourceEntity?: string; sourceTitle?: string } = {}) => {
      const created = createWorkflowFromTemplate({
        template,
        owner: CURRENT_WORKFLOW_USER,
        ownerName: CURRENT_USER_NAME,
        title: options.title,
        description: options.description,
        priority: options.priority,
        sourceId: options.sourceId,
        sourceEntity: options.sourceEntity,
        sourceTitle: options.sourceTitle,
        now: new Date().toISOString(),
      });
      setWorkflows((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const submitForReview = useCallback((id: string) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? submitWorkflowForReview(workflow, CURRENT_WORKFLOW_USER, CURRENT_USER_NAME, new Date().toISOString())
          : workflow,
      ),
    );
  }, []);

  const requestRevision = useCallback((id: string, comment: string) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? requestWorkflowRevision(workflow, CURRENT_WORKFLOW_USER, CURRENT_USER_NAME, comment, new Date().toISOString())
          : workflow,
      ),
    );
  }, []);

  const submitRevision = useCallback((id: string) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? submitWorkflowRevision(workflow, CURRENT_WORKFLOW_USER, CURRENT_USER_NAME, new Date().toISOString())
          : workflow,
      ),
    );
  }, []);

  const approve = useCallback((id: string, comment?: string) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? approveWorkflow(workflow, CURRENT_WORKFLOW_USER, CURRENT_USER_NAME, comment, new Date().toISOString())
          : workflow,
      ),
    );
  }, []);

  const complete = useCallback((id: string) => {
    setWorkflows((current) =>
      current.map((workflow) =>
        workflow.id === id
          ? completeWorkflow(workflow, CURRENT_WORKFLOW_USER, CURRENT_USER_NAME, new Date().toISOString())
          : workflow,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      workflows,
      filtered,
      searchResults,
      myWorkflows,
      awaiting,
      statistics,
      analytics,
      insights,
      portfolio,
      featured,
      templates: WORKFLOW_TEMPLATES,
      defaultWorkflow: DEFAULT_WORKFLOW,
      defaultKind: DEFAULT_WORKFLOW_KIND,
      query,
      setQuery,
      kind,
      setKind,
      status,
      setStatus,
      sort,
      setSort,
      currentUser: CURRENT_WORKFLOW_USER,
      currentUserName: CURRENT_USER_NAME,
      workflowById,
      stageOf,
      progressOf,
      createFromTemplate,
      submitForReview,
      requestRevision,
      submitRevision,
      approve,
      complete,
    }),
    [
      workflows,
      filtered,
      searchResults,
      myWorkflows,
      awaiting,
      statistics,
      analytics,
      insights,
      portfolio,
      featured,
      query,
      kind,
      status,
      sort,
      workflowById,
      stageOf,
      progressOf,
      createFromTemplate,
      submitForReview,
      requestRevision,
      submitRevision,
      approve,
      complete,
    ],
  );
}

export type { WorkflowInstance, WorkflowStage };

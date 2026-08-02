'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  CURRENT_TASK_USER,
  DEFAULT_TASK,
  TASKS,
  TASK_ANALYTICS,
  TASK_STATISTICS,
} from '@/constants/placeholder-tasks';
import {
  addTaskComment,
  buildTaskBoard,
  createTask,
  filterTasks,
  openTasks,
  overdueTasks,
  searchTasks,
  sortTasks,
  taskProgress,
  tasksForAssignee,
  updateTaskStatus,
} from '@/lib/tasks';
import type {
  Task,
  TaskFilter,
  TaskPriority,
  TaskSort,
  TaskStatus,
} from '@/types/tasks';

const CURRENT_USER_NAME = 'Dr. Adebisi Ojurere';

export default function useTasks() {
  const [tasks, setTasks] = useState(TASKS);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | TaskStatus>('all');
  const [priority, setPriority] = useState<'all' | TaskPriority>('all');
  const [sort, setSort] = useState<TaskSort>('recent');

  const filtered = useMemo(() => {
    const filter: TaskFilter = {
      status: status === 'all' ? undefined : status,
      priority: priority === 'all' ? undefined : priority,
    };
    return sortTasks(filterTasks(tasks, filter), sort);
  }, [tasks, status, priority, sort]);

  const searchResults = useMemo(() => (query.trim() ? searchTasks(tasks, query) : []), [query, tasks]);

  const myTasks = useMemo(() => tasksForAssignee(tasks, CURRENT_TASK_USER), [tasks]);
  const open = useMemo(() => openTasks(tasks), [tasks]);
  const overdue = useMemo(() => overdueTasks(tasks, new Date().toISOString()), [tasks]);

  const statistics = useMemo(() => TASK_STATISTICS, []);
  const analytics = useMemo(() => TASK_ANALYTICS, []);
  const board = useMemo(() => buildTaskBoard(tasks), [tasks]);

  const taskById = useCallback((id: string) => tasks.find((task) => task.id === id), [tasks]);

  const progressOf = useCallback((id: string) => {
    const task = taskById(id);
    return task ? taskProgress(task) : 0;
  }, [taskById]);

  const createNewTask = useCallback(
    (input: { title: string; description?: string; priority?: TaskPriority; assignee?: string; assigneeName?: string; workflowId?: string; dueDate?: string }) => {
      const created = createTask({
        title: input.title,
        description: input.description,
        priority: input.priority,
        assignee: input.assignee,
        assigneeName: input.assigneeName,
        workflowId: input.workflowId,
        dueDate: input.dueDate,
        createdBy: CURRENT_TASK_USER,
        createdByName: CURRENT_USER_NAME,
      });
      setTasks((current) => [created, ...current]);
      return created;
    },
    [],
  );

  const changeStatus = useCallback((id: string, nextStatus: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? updateTaskStatus({ task, status: nextStatus, actor: CURRENT_TASK_USER, actorName: CURRENT_USER_NAME })
          : task,
      ),
    );
  }, []);

  const commentOn = useCallback((id: string, body: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? addTaskComment({ task, author: CURRENT_TASK_USER, authorName: CURRENT_USER_NAME, body }).task
          : task,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      tasks,
      filtered,
      searchResults,
      myTasks,
      open,
      overdue,
      statistics,
      analytics,
      board,
      defaultTask: DEFAULT_TASK,
      query,
      setQuery,
      status,
      setStatus,
      priority,
      setPriority,
      sort,
      setSort,
      currentUser: CURRENT_TASK_USER,
      currentUserName: CURRENT_USER_NAME,
      taskById,
      progressOf,
      createNewTask,
      changeStatus,
      commentOn,
    }),
    [
      tasks,
      filtered,
      searchResults,
      myTasks,
      open,
      overdue,
      statistics,
      analytics,
      board,
      query,
      status,
      priority,
      sort,
      taskById,
      progressOf,
      createNewTask,
      changeStatus,
      commentOn,
    ],
  );
}

export type { Task };

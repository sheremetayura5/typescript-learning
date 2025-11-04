import path from "path";
import { DEFAULT_PRIORITY, DEFAULT_STATUS, VALID_PRIORITIES, VALID_STATUSES } from "./constants";
import { ID, Priority, Status, Task } from "./dto/Task";

export const isStatus = (v: unknown): v is Status => typeof v === "string" && (VALID_STATUSES as readonly string[]).includes(v);
export const isPriority = (v: unknown): v is Priority => typeof v === "string" && (VALID_PRIORITIES as readonly string[]).includes(v);

export type TaskCreate = {
  id: ID;
  title: string;
  createdAt: string | Date;
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: string | Date;
  completedAt?: string | Date;
};

export type TaskUpdate = Partial<Omit<Task, "id">>;

const toDate = (v: string | Date | undefined): Date | undefined => {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
};

export const validateAndEnrich = (raw: unknown): Task => {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid task: not an object");
  }
  const o = raw as Record<string, unknown>;
  const id = o.id as ID;
  const title = o.title as string;
  const createdAt = o.createdAt as string | Date | undefined;
  if ((typeof id !== "string" && typeof id !== "number") || typeof title !== "string" || !createdAt) {
    throw new Error("Invalid task: missing required fields id, title, createdAt");
    }
  const description = typeof o.description === "string" ? o.description : undefined;
  const status = isStatus(o.status) ? o.status : DEFAULT_STATUS;
  const priority = isPriority(o.priority) ? o.priority : DEFAULT_PRIORITY;
  const deadline = typeof o.deadline === "string" || o.deadline instanceof Date ? (o.deadline as string | Date) : undefined;
  const completedAt = typeof o.completedAt === "string" || o.completedAt instanceof Date ? (o.completedAt as string | Date) : undefined;
  return { id, title, description, createdAt, status, priority, deadline, completedAt };
};

export const fromJsonArray = (data: unknown): Task[] => {
  if (!Array.isArray(data)) {
    throw new Error("tasks.json must contain an array");
  }
  return data.map(validateAndEnrich);
};

export const getTaskById = (tasks: Task[], id: ID): Task | undefined => tasks.find(t => t.id === id);

export const createTask = (tasks: Task[], input: TaskCreate): Task => {
  const base: Task = {
    id: input.id,
    title: input.title,
    createdAt: input.createdAt,
    description: input.description,
    status: input.status ?? DEFAULT_STATUS,
    priority: input.priority ?? DEFAULT_PRIORITY,
    deadline: input.deadline,
    completedAt: input.completedAt,
  };
  const existing = getTaskById(tasks, base.id);
  if (existing) throw new Error("Task with the same id already exists");
  tasks.push(base);
  return base;
};

export const updateTask = (tasks: Task[], id: ID, update: TaskUpdate): Task => {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  const current = tasks[idx];
  const merged: Task = {
    ...current,
    ...update,
    status: update.status ?? current.status,
    priority: update.priority ?? current.priority,
  };
  tasks[idx] = merged;
  return merged;
};

export const deleteTask = (tasks: Task[], id: ID): boolean => {
  const len = tasks.length;
  const next = tasks.filter(t => t.id !== id);
  tasks.length = 0;
  tasks.push(...next);
  return next.length !== len;
};

export type TaskFilters = {
  status?: Status;
  priority?: Priority;
  createdFrom?: string | Date;
  createdTo?: string | Date;
};

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  const from = toDate(filters.createdFrom);
  const to = toDate(filters.createdTo);
  return tasks.filter(t => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    const created = toDate(t.createdAt);
    if (from && created && created < from) return false;
    if (to && created && created > to) return false;
    return true;
  });
};

export const completedBeforeDeadline = (task: Task): boolean => {
  const d = toDate(task.deadline);
  const c = toDate(task.completedAt);
  if (!d || !c) return false;
  return c.getTime() <= d.getTime();
};

export const lesson2DataPath = (...segments: string[]): string => path.join(__dirname, ...segments);

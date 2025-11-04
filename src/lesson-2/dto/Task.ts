export type Status = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type ID = string | number;

export interface Task {
  id: ID;
  title: string;
  description?: string;
  createdAt: string | Date;
  status: Status;
  priority: Priority;
  deadline?: string | Date;
  completedAt?: string | Date;
}

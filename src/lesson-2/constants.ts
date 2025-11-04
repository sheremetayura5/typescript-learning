import { Priority, Status } from "./dto/Task";

export const DEFAULT_STATUS: Status = "todo";
export const DEFAULT_PRIORITY: Priority = "medium";

export const VALID_STATUSES: readonly Status[] = ["todo", "in_progress", "done"] as const;
export const VALID_PRIORITIES: readonly Priority[] = ["low", "medium", "high"] as const;

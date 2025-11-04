import tasksData from "./tasks.json";
import { fromJsonArray, getTaskById, createTask, updateTask, deleteTask, filterTasks, completedBeforeDeadline } from "./utils";
import { Task } from "./dto/Task";
import { DEFAULT_PRIORITY, DEFAULT_STATUS } from "./constants";

const tasks: Task[] = fromJsonArray(tasksData);
const initialCount = tasks.length;

const t1 = getTaskById(tasks, 1);

const newTask = createTask(tasks, {
  id: 11,
  title: "New task example",
  createdAt: new Date().toISOString(),
  status: DEFAULT_STATUS,
  priority: DEFAULT_PRIORITY,
});

const updated = updateTask(tasks, 2, { status: "in_progress" });

const removed = deleteTask(tasks, 5);

const filtered = filterTasks(tasks, { status: "in_progress", priority: "high" });

const deadlineOk = t1 ? completedBeforeDeadline(t1) : false;

console.log("Lesson 2 summary:");
console.log("- initial count:", initialCount);
console.log("- after create count:", tasks.length);
console.log("- updated #2 status:", updated.status);
console.log("- removed id 5:", removed);
console.log("- filtered in_progress & high count:", filtered.length);
console.log("- task #1 completed before deadline:", deadlineOk);
console.log("- created task:", newTask);

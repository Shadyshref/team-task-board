export type UserRole = "ADMIN" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "FORBIDDEN"
  | "TRUSTED_ORIGIN_REQUIRED"
  | "RATE_LIMITED"
  | "USER_NOT_FOUND"
  | "EMAIL_ALREADY_EXISTS"
  | "PROJECT_NOT_FOUND"
  | "MEMBERSHIP_NOT_FOUND"
  | "MEMBERSHIP_ALREADY_EXISTS"
  | "OWNER_REMOVAL_FORBIDDEN"
  | "TASK_NOT_FOUND"
  | "INVALID_ASSIGNEE"
  | "DATABASE_CONFLICT"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserPreview = Pick<User, "id" | "name" | "email" | "role">;

export type Project = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: UserPreview;
  _count: {
    member: number;
    task: number;
  };
};

export type ProjectMember = {
  projectId: string;
  userId: string;
  createdAt: string;
  user: UserPreview;
  isOwner?: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  projectId: string;
  creatorId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  creator: UserPreview;
  assignee: UserPreview | null;
};

export type DashboardSummary = {
  accessibleProjectCount: number;
  ownedProjectCount: number;
  openTaskCount: number;
  inProgressTaskCount: number;
  dueThisWeekCount: number;
  highPriorityDueThisWeekCount: number;
  overdueTaskCount: number;
  assignedToCurrentUserCount: number;
  weekStartsAt: string;
  weekEndsAt: string;
};

export type ProjectSummary = {
  memberCount: number;
  taskCount: number;
  openTaskCount: number;
  overdueTaskCount: number;
  assignedToCurrentUserCount: number;
  taskCountByStatus: Array<{
    status: TaskStatus;
    count: number;
  }>;
  taskCountByPriority: Array<{
    priority: TaskPriority;
    count: number;
  }>;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CreateProjectInput = {
  name: string;
  description?: string | null;
};

export type UpdateProjectInput = {
  name?: string;
  description?: string | null;
};

export type AddProjectMemberInput = {
  email: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
};

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | "unassigned";
};

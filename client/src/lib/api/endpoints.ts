export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    currentUser: "/auth/me",
  },
  projects: {
    list: "/projects",
    detail: (projectId: string) => `/projects/${projectId}`,
    members: (projectId: string) => `/projects/${projectId}/members`,
    member: (projectId: string, userId: string) =>
      `/projects/${projectId}/members/${userId}`,
    tasks: (projectId: string) => `/projects/${projectId}/tasks`,
    task: (projectId: string, taskId: string) =>
      `/projects/${projectId}/tasks/${taskId}`,
    summary: (projectId: string) => `/projects/${projectId}/summary`,
  },
  dashboard: {
    summary: "/dashboard/summary",
  },
} as const;

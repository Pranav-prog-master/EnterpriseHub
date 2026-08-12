import api from "@/lib/axios";

export const projectService = {
  list: (params?: any) =>
    api.get("/projects/", { params }).then((r) => r.data),

  get: (id: string) =>
    api.get(`/projects/${id}/`).then((r) => r.data),

  create: (data: any) =>
    api.post("/projects/", data).then((r) => r.data),

  update: (id: string, data: any) =>
    api.patch(`/projects/${id}/`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/projects/${id}/`).then((r) => r.data),

  analyzeRisk: (id: string) =>
    api.post(`/projects/${id}/analyze_risk/`).then((r) => r.data),

  // Tasks
  listTasks: (params?: any) =>
    api.get("/projects/tasks/", { params }).then((r) => r.data),

  getTask: (id: string) =>
    api.get(`/projects/tasks/${id}/`).then((r) => r.data),

  createTask: (data: any) =>
    api.post("/projects/tasks/", data).then((r) => r.data),

  updateTask: (id: string, data: any) =>
    api.patch(`/projects/tasks/${id}/`, data).then((r) => r.data),

  deleteTask: (id: string) =>
    api.delete(`/projects/tasks/${id}/`).then((r) => r.data),

  // Sprints
  listSprints: (params?: any) =>
    api.get("/projects/sprints/", { params }).then((r) => r.data),

  createSprint: (data: any) =>
    api.post("/projects/sprints/", data).then((r) => r.data),

  // Comments
  listComments: (taskId: string) =>
    api.get("/projects/comments/", { params: { task: taskId } }).then((r) => r.data),

  createComment: (data: any) =>
    api.post("/projects/comments/", data).then((r) => r.data),

  // Time logs
  createTimeLog: (data: any) =>
    api.post("/projects/time-logs/", data).then((r) => r.data),

  // Milestones
  listMilestones: (projectId: string) =>
    api.get("/projects/milestones/", { params: { project: projectId } }).then((r) => r.data),
};

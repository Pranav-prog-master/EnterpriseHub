import api from "@/lib/axios";

export const hrService = {
  listEmployees: (params?: any) =>
    api.get("/hr/employees/", { params }).then((r) => r.data),

  getEmployee: (id: string) =>
    api.get(`/hr/employees/${id}/`).then((r) => r.data),

  createEmployee: (data: any) =>
    api.post("/hr/employees/", data).then((r) => r.data),

  updateEmployee: (id: string, data: any) =>
    api.patch(`/hr/employees/${id}/`, data).then((r) => r.data),

  deleteEmployee: (id: string) =>
    api.delete(`/hr/employees/${id}/`).then((r) => r.data),

  // Attendance
  listAttendance: (params?: any) =>
    api.get("/hr/attendance/", { params }).then((r) => r.data),

  createAttendance: (data: any) =>
    api.post("/hr/attendance/", data).then((r) => r.data),

  // Leave
  listLeaveRequests: (params?: any) =>
    api.get("/hr/leave-requests/", { params }).then((r) => r.data),

  createLeaveRequest: (data: any) =>
    api.post("/hr/leave-requests/", data).then((r) => r.data),

  approveLeave: (id: string) =>
    api.post(`/hr/leave-requests/${id}/approve/`).then((r) => r.data),

  rejectLeave: (id: string) =>
    api.post(`/hr/leave-requests/${id}/reject/`).then((r) => r.data),

  // Recruitment
  listJobs: (params?: any) =>
    api.get("/hr/jobs/", { params }).then((r) => r.data),

  createJob: (data: any) =>
    api.post("/hr/jobs/", data).then((r) => r.data),

  listCandidates: (params?: any) =>
    api.get("/hr/candidates/", { params }).then((r) => r.data),

  createCandidate: (data: FormData) =>
    api.post("/hr/candidates/", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),

  aiScreenCandidate: (id: string) =>
    api.post(`/hr/candidates/${id}/ai_screen/`).then((r) => r.data),

  // Performance
  listReviews: (params?: any) =>
    api.get("/hr/performance/", { params }).then((r) => r.data),

  createReview: (data: any) =>
    api.post("/hr/performance/", data).then((r) => r.data),
};

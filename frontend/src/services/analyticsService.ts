import api from "@/lib/axios";

export const analyticsService = {
  getDashboard: () =>
    api.get("/analytics/dashboard/").then((r) => r.data),

  getHR: () =>
    api.get("/analytics/hr/").then((r) => r.data),
};

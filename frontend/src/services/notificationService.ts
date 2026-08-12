import api from "@/lib/axios";

export const notificationService = {
  list: () =>
    api.get("/notifications/").then((r) => r.data),

  markRead: (id: string) =>
    api.post(`/notifications/${id}/mark_read/`).then((r) => r.data),

  markAllRead: () =>
    api.post("/notifications/mark_all_read/").then((r) => r.data),
};

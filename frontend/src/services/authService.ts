import api from "@/lib/axios";

export const authService = {
  login: (data: { email: string; password: string; role?: string }) =>
    api.post("/auth/login/", data).then((r) => r.data),

  register: (data: any) =>
    api.post("/auth/register/", data).then((r) => r.data),

  logout: (refresh: string) =>
    api.post("/auth/logout/", { refresh }).then((r) => r.data),

  resetPassword: (email: string) =>
    api.post("/auth/password-reset/", { email }).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post("/auth/password-reset/", { email }).then((r) => r.data),

  getMe: () =>
    api.get("/users/me/").then((r) => r.data),
};

import api from "@/lib/axios";

export const collaborationService = {
  listChannels: () =>
    api.get("/collaboration/channels/").then((r) => r.data),

  getChannel: (id: string) =>
    api.get(`/collaboration/channels/${id}/`).then((r) => r.data),

  createChannel: (data: any) =>
    api.post("/collaboration/channels/", data).then((r) => r.data),

  listMessages: (channelId: string) =>
    api.get("/collaboration/messages/", { params: { channel: channelId } }).then((r) => r.data),

  sendMessage: (data: any) =>
    api.post("/collaboration/messages/", data).then((r) => r.data),
};

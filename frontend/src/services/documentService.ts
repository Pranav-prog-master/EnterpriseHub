import api from "@/lib/axios";

export const documentService = {
  list: (params?: any) =>
    api.get("/documents/", { params }).then((r) => r.data),

  get: (id: string) =>
    api.get(`/documents/${id}/`).then((r) => r.data),

  upload: (data: FormData) =>
    api.post("/documents/", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/documents/${id}/`).then((r) => r.data),

  semanticSearch: (query: string) =>
    api.post("/documents/semantic_search/", { query }).then((r) => r.data),

  // Folders
  listFolders: () =>
    api.get("/documents/folders/").then((r) => r.data),

  createFolder: (data: any) =>
    api.post("/documents/folders/", data).then((r) => r.data),
};

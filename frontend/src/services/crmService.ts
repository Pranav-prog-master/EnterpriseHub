import api from "@/lib/axios";

export const crmService = {
  // Leads
  listLeads: (params?: any) =>
    api.get("/crm/leads/", { params }).then((r) => r.data),

  getLead: (id: string) =>
    api.get(`/crm/leads/${id}/`).then((r) => r.data),

  createLead: (data: any) =>
    api.post("/crm/leads/", data).then((r) => r.data),

  updateLead: (id: string, data: any) =>
    api.patch(`/crm/leads/${id}/`, data).then((r) => r.data),

  deleteLead: (id: string) =>
    api.delete(`/crm/leads/${id}/`).then((r) => r.data),

  // Customers
  listCustomers: (params?: any) =>
    api.get("/crm/customers/", { params }).then((r) => r.data),

  getCustomer: (id: string) =>
    api.get(`/crm/customers/${id}/`).then((r) => r.data),

  createCustomer: (data: any) =>
    api.post("/crm/customers/", data).then((r) => r.data),

  updateCustomer: (id: string, data: any) =>
    api.patch(`/crm/customers/${id}/`, data).then((r) => r.data),

  // Deals
  listDeals: (params?: any) =>
    api.get("/crm/deals/", { params }).then((r) => r.data),

  createDeal: (data: any) =>
    api.post("/crm/deals/", data).then((r) => r.data),

  updateDeal: (id: string, data: any) =>
    api.patch(`/crm/deals/${id}/`, data).then((r) => r.data),
};

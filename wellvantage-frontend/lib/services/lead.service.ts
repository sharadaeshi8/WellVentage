import { api } from "../api/axios";
import type { Lead } from "../types";

export const leadService = {
  async getLeads(filters?: unknown) {
    const { data } = await api.get("/leads", { params: filters });
    return data;
  },

  async getLead(id: string) {
    const { data } = await api.get(`/leads/${id}`);
    return data;
  },

  async createLead(leadData: Partial<Lead>) {
    const { data } = await api.post("/leads", leadData);
    return data;
  },

  async updateLead(id: string, leadData: Partial<Lead>) {
    const { data } = await api.put(`/leads/${id}`, leadData);
    return data;
  },

  async updateLeadStatus(id: string, status: string) {
    const { data } = await api.put(`/leads/${id}/status`, { status });
    return data;
  },

  async deleteLead(id: string) {
    const { data } = await api.delete(`/leads/${id}`);
    return data;
  },

  async archiveLead(id: string) {
    const { data } = await api.patch(`/leads/${id}/archive`);
    return data;
  },

  async addNote(id: string, text: string) {
    const { data } = await api.post(`/leads/${id}/notes`, { text });
    return data;
  },

  async bulkArchive(ids: string[]) {
    const { data } = await api.patch("/leads/bulk-archive", { ids });
    return data;
  },

  async bulkDelete(ids: string[]) {
    const { data } = await api.delete("/leads/bulk-delete", { data: { ids } });
    return data;
  },
};

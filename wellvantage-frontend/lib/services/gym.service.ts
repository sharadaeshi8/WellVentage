import { api } from '../api/axios';
import type { Gym } from '../types';

export const gymService = {
  async createGym(gymData: Partial<Gym>) {
    const { data } = await api.post('/gyms', gymData);
    return data;
  },

  async getGym(id: string) {
    const { data } = await api.get(`/gyms/${id}`);
    return data;
  },

  async updateGym(id: string, gymData: Partial<Gym>) {
    const { data } = await api.put(`/gyms/${id}`, gymData);
    return data;
  },
};
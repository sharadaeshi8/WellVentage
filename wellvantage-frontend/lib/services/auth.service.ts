import { api } from "../api/axios";
import type { AuthMeResponse } from "../types";

export const authService = {
  async sendVerificationCode(phone: string, country?: string) {
    const { data } = await api.post("/auth/phone/send-code", {
      phone,
      country,
    });
    return data;
  },

  async verifyCode(phone: string, code: string, country?: string) {
    const { data } = await api.post("/auth/phone/verify-code", {
      phone,
      code,
      country,
    });
    return data;
  },

  async logout() {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  async getCurrentUser(): Promise<AuthMeResponse> {
    const { data } = await api.get<AuthMeResponse>("/auth/me");
    return data;
  },
};

import { api } from "../../../lib/api";

export type ApplicationStatusType = 
  | "discovered"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "archived";

export interface ApplicationJob {
  id: number;
  title: string;
  company_name: string;
  location?: string;
  url?: string;
}

export interface ApplicationItem {
  id: number;
  user_id: number;
  job_id?: number;
  resume_id?: number;
  status: ApplicationStatusType;
  match_score?: number;
  applied_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  job?: ApplicationJob;
  // Local/manual fallback fields for external applications
  company_name?: string;
  job_title?: string;
  salary_range?: string;
}

export interface ApplicationCreatePayload {
  job_id?: number;
  resume_id?: number;
  status?: ApplicationStatusType;
  notes?: string;
  // External job fields
  title?: string;
  company_name?: string;
  location?: string;
  url?: string;
}

export const applicationsService = {
  async getApplications(status?: string): Promise<ApplicationItem[]> {
    try {
      const response = await api.get("/applications", {
        params: status ? { status } : {}
      });
      return response.data;
    } catch (err) {
      console.warn("API offline, using local application store fallback", err);
      const local = localStorage.getItem("career_companion_applications");
      return local ? JSON.parse(local) : [];
    }
  },

  async createApplication(payload: ApplicationCreatePayload): Promise<ApplicationItem> {
    try {
      const response = await api.post("/applications", payload);
      return response.data;
    } catch (err) {
      console.warn("API create offline, saving locally", err);
      const newApp: ApplicationItem = {
        id: Date.now(),
        user_id: 1,
        job_id: payload.job_id,
        resume_id: payload.resume_id,
        status: payload.status || "discovered",
        notes: payload.notes || "",
        match_score: 85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job: payload.job_id ? undefined : {
          id: Date.now(),
          title: payload.title || "Software Engineer",
          company_name: payload.company_name || "Tech Corp",
          location: payload.location || "Remote / Bengaluru",
          url: payload.url || ""
        }
      };
      const existing = await this.getApplications();
      const updated = [newApp, ...existing];
      localStorage.setItem("career_companion_applications", JSON.stringify(updated));
      return newApp;
    }
  },

  async updateApplication(id: number, updates: Partial<ApplicationItem>): Promise<ApplicationItem> {
    try {
      const response = await api.patch(`/applications/${id}`, updates);
      return response.data;
    } catch (err) {
      console.warn("API update offline, updating locally", err);
      const existing = await this.getApplications();
      const idx = existing.findIndex(a => a.id === id);
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem("career_companion_applications", JSON.stringify(existing));
        return existing[idx];
      }
      throw err;
    }
  },

  async deleteApplication(id: number): Promise<void> {
    try {
      await api.delete(`/applications/${id}`);
    } catch (err) {
      console.warn("API delete offline, deleting locally", err);
      const existing = await this.getApplications();
      const filtered = existing.filter(a => a.id !== id);
      localStorage.setItem("career_companion_applications", JSON.stringify(filtered));
    }
  }
};

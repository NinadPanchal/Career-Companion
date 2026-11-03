import { api } from '../../../lib/api';

export type JobMatchResult = {
  match_score: number;
  job_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
};

export type DiscoveredJob = {
  external_id: string;
  title: string;
  company_name: string;
  location: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  description: string | null;
  url: string | null;
  source: string;
  posted_at: string | null;
  match_score: number | null;
  matched_skills: string[];
  missing_skills: string[];
};

export type SavedJob = {
  id: number;
  title: string;
  company_name: string;
  location: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  url: string | null;
  source: string | null;
  posted_at: string | null;
  created_at: string;
  skills: string[];
};

export type ApplicationStats = {
  total: number;
  by_status: Record<string, number>;
  avg_match_score: number | null;
  applied_this_week: number;
  applied_this_month: number;
};

export const jobsService = {
  async matchJob(description: string, resumeSkills: string[]) {
    const response = await api.post<JobMatchResult>('/jobs/match', {
      description,
      resume_skills: resumeSkills,
    });
    return response.data;
  },

  async discoverJobs(query: string, location?: string, remoteOnly?: boolean, page?: number) {
    const response = await api.get<DiscoveredJob[]>('/jobs/discover', {
      params: {
        query,
        location: location || undefined,
        remote_only: remoteOnly || false,
        page: page || 1,
      },
    });
    return response.data;
  },

  async saveDiscoveredJob(job: DiscoveredJob) {
    const response = await api.post<SavedJob>('/jobs/discover/save', {
      external_id: job.external_id,
      title: job.title,
      company_name: job.company_name,
      location: job.location,
      is_remote: job.is_remote,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      currency: job.currency,
      description: job.description,
      url: job.url,
      source: job.source,
    });
    return response.data;
  },

  async listSavedJobs(page?: number) {
    const response = await api.get<SavedJob[]>('/jobs', {
      params: { page: page || 1, per_page: 50 },
    });
    return response.data;
  },

  async getApplicationStats() {
    const response = await api.get<ApplicationStats>('/applications/stats');
    return response.data;
  },

  async getJobDetails(jobId: string) {
    const response = await api.get<any>(`/jobs/details/${encodeURIComponent(jobId)}`);
    return response.data;
  },

  async getEstimatedSalary(jobTitle: string, location?: string) {
    const response = await api.get<{ job_title: string; location: string; estimates: any[] }>('/jobs/salary/estimate', {
      params: { job_title: jobTitle, location: location || 'India' },
    });
    return response.data;
  },

  async getCompanySalary(company: string, jobTitle: string) {
    const response = await api.get<{ company: string; job_title: string; benchmarks: any[] }>('/jobs/salary/company', {
      params: { company, job_title: jobTitle },
    });
    return response.data;
  },

  async getApiKeys() {
    const response = await api.get<any>('/settings/keys');
    return response.data;
  },

  async updateApiKeys(payload: {
    jsearch_api_key?: string;
    jsearch_search_key?: string;
    jsearch_details_key?: string;
    jsearch_salary_key?: string;
    jsearch_company_salary_key?: string;
  }) {
    const response = await api.post<any>('/settings/keys', payload);
    return response.data;
  },
};

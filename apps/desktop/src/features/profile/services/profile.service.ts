import { api } from "../../../lib/api";

export interface ExperienceItem {
  company: string;
  title: string;
  start?: string;
  end?: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field?: string;
  graduation_year?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  link?: string;
  bullets: string[];
}

export interface ATSResult {
  score: number;
  issues: string[];
  breakdown?: Record<string, any>;
}

export interface CandidateProfile {
  id?: number;
  user_id?: number;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  ats_score?: number;
  ats_issues?: string[];
  ats?: ATSResult;
  resume_id?: number;
  resume_filename?: string;
}

export interface ResumeParseResponse {
  profile: CandidateProfile;
  resume_id: number;
  original_filename: string;
  stored_filename: string;
  word_count: number;
  ats: ATSResult;
}

export const profileService = {
  async getProfile(): Promise<CandidateProfile | null> {
    try {
      const response = await api.get<CandidateProfile>("/profile");
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  async saveProfile(profile: CandidateProfile): Promise<CandidateProfile> {
    const response = await api.post<CandidateProfile>("/profile", profile);
    return response.data;
  },

  async resetWorkspace(): Promise<void> {
    await api.delete("/profile");
  },

  async parseResume(file: File): Promise<ResumeParseResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<ResumeParseResponse>("/resume/parse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};


import { create } from 'zustand';

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

type JobsState = {
  discoveredJobs: DiscoveredJob[];
  savedJobs: SavedJob[];
  isSearching: boolean;
  searchQuery: string;
  searchLocation: string;
  remoteOnly: boolean;
  setDiscoveredJobs: (jobs: DiscoveredJob[]) => void;
  setSavedJobs: (jobs: SavedJob[]) => void;
  setIsSearching: (val: boolean) => void;
  setSearchQuery: (q: string) => void;
  setSearchLocation: (l: string) => void;
  setRemoteOnly: (r: boolean) => void;
  clearSearch: () => void;
};

export const useJobsStore = create<JobsState>((set) => ({
  discoveredJobs: [],
  savedJobs: [],
  isSearching: false,
  searchQuery: '',
  searchLocation: '',
  remoteOnly: false,
  setDiscoveredJobs: (jobs) => set({ discoveredJobs: Array.isArray(jobs) ? jobs : [] }),
  setSavedJobs: (jobs) => set({ savedJobs: Array.isArray(jobs) ? jobs : [] }),
  setIsSearching: (val) => set({ isSearching: val }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchLocation: (l) => set({ searchLocation: l }),
  setRemoteOnly: (r) => set({ remoteOnly: r }),
  clearSearch: () => set({ discoveredJobs: [], searchQuery: '', searchLocation: '', remoteOnly: false }),
}));

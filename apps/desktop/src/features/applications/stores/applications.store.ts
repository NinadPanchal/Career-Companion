import { create } from "zustand";
import { ApplicationItem, ApplicationStatusType, applicationsService, ApplicationCreatePayload } from "../services/applications.service";

interface ApplicationsState {
  applications: ApplicationItem[];
  isLoading: boolean;
  selectedApp: ApplicationItem | null;
  searchQuery: string;
  filterStatus: string;
  isAddModalOpen: boolean;
  
  fetchApplications: () => Promise<void>;
  addApplication: (payload: ApplicationCreatePayload) => Promise<void>;
  updateStatus: (id: number, status: ApplicationStatusType) => Promise<void>;
  updateNotes: (id: number, notes: string) => Promise<void>;
  deleteApplication: (id: number) => Promise<void>;
  setSelectedApp: (app: ApplicationItem | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setIsAddModalOpen: (open: boolean) => void;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  isLoading: false,
  selectedApp: null,
  searchQuery: "",
  filterStatus: "all",
  isAddModalOpen: false,

  fetchApplications: async () => {
    set({ isLoading: true });
    try {
      const data = await applicationsService.getApplications();
      // If empty, provide default seed applications for high UX polish
      if (!data || data.length === 0) {
        const sampleApps: ApplicationItem[] = [
          {
            id: 101,
            user_id: 1,
            status: "interview",
            match_score: 94,
            notes: "Round 2 System Design scheduled with Lead Architect on Thursday.",
            created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            updated_at: new Date().toISOString(),
            job: {
              id: 1,
              title: "Senior Full Stack Engineer",
              company_name: "Razorpay",
              location: "Bengaluru, India (Hybrid)",
              url: "https://razorpay.com/jobs"
            }
          },
          {
            id: 102,
            user_id: 1,
            status: "applied",
            match_score: 88,
            notes: "Referred by Senior Staff Engineer via LinkedIn outreach.",
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            updated_at: new Date().toISOString(),
            job: {
              id: 2,
              title: "Backend Platform Engineer",
              company_name: "Swiggy",
              location: "Bengaluru, India",
              url: "https://swiggy.com/careers"
            }
          },
          {
            id: 103,
            user_id: 1,
            status: "offer",
            match_score: 96,
            notes: "CTC Offer Letter received: ₹32 LPA Base + ₹6 Lakh ESOPs. Evaluating counter-offer.",
            created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
            updated_at: new Date().toISOString(),
            job: {
              id: 3,
              title: "Frontend Architect",
              company_name: "Postman",
              location: "Bengaluru, India (Remote)",
              url: "https://postman.com/careers"
            }
          },
          {
            id: 104,
            user_id: 1,
            status: "discovered",
            match_score: 91,
            notes: "Targeting AI SDK integrations team. Need to draft customized cover letter.",
            created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
            updated_at: new Date().toISOString(),
            job: {
              id: 4,
              title: "AI Solutions Engineer",
              company_name: "CRED",
              location: "Bengaluru, India",
              url: "https://cred.club/careers"
            }
          }
        ];
        set({ applications: sampleApps, isLoading: false });
        localStorage.setItem("career_companion_applications", JSON.stringify(sampleApps));
        return;
      }
      set({ applications: data, isLoading: false });
    } catch (err) {
      console.error("Failed to load applications", err);
      set({ isLoading: false });
    }
  },

  addApplication: async (payload) => {
    try {
      const newApp = await applicationsService.createApplication(payload);
      set(state => ({
        applications: [newApp, ...state.applications.filter(a => a.id !== newApp.id)],
        isAddModalOpen: false
      }));
    } catch (err) {
      console.error("Failed to add application", err);
    }
  },

  updateStatus: async (id, status) => {
    // Optimistic UI update
    set(state => ({
      applications: state.applications.map(app => 
        app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app
      )
    }));
    try {
      await applicationsService.updateApplication(id, { status });
    } catch (err) {
      console.error("Failed to update application status", err);
      // Revert if needed
      get().fetchApplications();
    }
  },

  updateNotes: async (id, notes) => {
    set(state => ({
      applications: state.applications.map(app => 
        app.id === id ? { ...app, notes } : app
      )
    }));
    try {
      await applicationsService.updateApplication(id, { notes });
    } catch (err) {
      console.error("Failed to update notes", err);
    }
  },

  deleteApplication: async (id) => {
    set(state => ({
      applications: state.applications.filter(app => app.id !== id),
      selectedApp: state.selectedApp?.id === id ? null : state.selectedApp
    }));
    try {
      await applicationsService.deleteApplication(id);
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  },

  setSelectedApp: (app) => set({ selectedApp: app }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen })
}));

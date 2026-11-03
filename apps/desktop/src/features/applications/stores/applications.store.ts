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
      set({ applications: data || [], isLoading: false });
    } catch (err) {
      console.error("Failed to load applications", err);
      set({ applications: [], isLoading: false });
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

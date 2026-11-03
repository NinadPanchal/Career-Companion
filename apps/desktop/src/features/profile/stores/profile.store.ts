import { create } from "zustand";
import { profileService, CandidateProfile } from "../services/profile.service";

interface ProfileState {
  profile: CandidateProfile | null;
  isLoading: boolean;
  hasChecked: boolean;
  isOnboardingOpen: boolean;

  fetchProfile: () => Promise<CandidateProfile | null>;
  setProfile: (profile: CandidateProfile | null) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  resetWorkspace: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: true,
  hasChecked: false,
  isOnboardingOpen: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const data = await profileService.getProfile();
      set({ profile: data, isLoading: false, hasChecked: true });
      return data;
    } catch (err) {
      console.error("Failed to fetch candidate profile", err);
      set({ profile: null, isLoading: false, hasChecked: true });
      return null;
    }
  },

  setProfile: (profile) => set({ profile, hasChecked: true }),
  openOnboarding: () => set({ isOnboardingOpen: true }),
  closeOnboarding: () => set({ isOnboardingOpen: false }),

  resetWorkspace: async () => {
    set({ isLoading: true });
    try {
      await profileService.resetWorkspace();
      set({ profile: null, isLoading: false, isOnboardingOpen: true });
    } catch (err) {
      console.error("Failed to reset workspace", err);
      set({ isLoading: false });
    }
  },
}));


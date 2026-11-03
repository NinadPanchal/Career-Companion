import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Applications from "./pages/Applications/Applications";
import Resume from "./pages/Resume/resume";
import Jobs from "./pages/Jobs/Jobs";
import CoverLetter from "./pages/CoverLetter/CoverLetter";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import Settings from "./pages/Settings/Settings";
import Onboarding from "./pages/Onboarding/Onboarding";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import { useProfileStore } from "./features/profile/stores/profile.store";
import { Spinner } from "./components/ui/Spinner";

function App() {
  const { profile, isLoading, hasChecked, isOnboardingOpen, fetchProfile, closeOnboarding } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Loading splash on cold start
  if (isLoading && !hasChecked) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-gradient)] text-[var(--text)] select-none">
        <Spinner size="lg" className="text-[var(--accent)] mb-4" />
        <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">
          Starting Career Companion...
        </p>
      </div>
    );
  }

  // First launch or manual onboarding requested: block until candidate profile exists
  if (!profile || isOnboardingOpen) {
    return <Onboarding onComplete={() => closeOnboarding()} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/onboarding" element={<Onboarding onComplete={() => closeOnboarding()} />} />
      </Route>
    </Routes>
  );
}

export default App;
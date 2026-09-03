import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Applications from "./pages/Applications/Applications";
import Resume from "./pages/Resume/resume";
import Jobs from "./pages/Jobs/Jobs";
import CoverLetter from "./pages/CoverLetter/CoverLetter";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import Settings from "./pages/Settings/Settings";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";

function App() {
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
            </Route>
        </Routes>
    );
}

export default App;
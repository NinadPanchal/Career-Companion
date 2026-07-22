import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Resume from "./pages/Resume/resume";
import Jobs from "./pages/Jobs/Jobs";
import Settings from "./pages/Settings/Settings";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;
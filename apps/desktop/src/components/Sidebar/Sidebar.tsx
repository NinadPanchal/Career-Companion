import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Home,
  User,
  Moon,
  Sparkles,
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="sidebar-title">Career Companion</h2>
                <p className="sidebar-subtitle">AI Career Assistant</p>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Moon size={14} className="text-indigo-400" />
              <span>Midnight OLED Theme</span>
              <Sparkles size={12} className="ml-auto text-amber-400" />
            </div>

            <nav>
              <ul className="sidebar-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                    <Home size={18} />
                    <span>Home</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/resume" className={({ isActive }) => isActive ? "active" : ""}>
                    <FileText size={18} />
                    <span>Resume Manager</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""}>
                    <Briefcase size={18} />
                    <span>Jobs India</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="sidebar-name truncate">Ninad Panchal</p>
              <p className="sidebar-role truncate">Bengaluru, India 🇮🇳</p>
            </div>
          </div>
        </aside>
    );
}

export default Sidebar;
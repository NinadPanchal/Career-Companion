import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Kanban,
  Send,
  Bot,
  Search,
  User,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
}

function Sidebar({ onOpenCommandPalette }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <h2 className="sidebar-title">Career Companion</h2>
        </div>

        {/* Quick search */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="mb-4 flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-[7px] text-xs text-zinc-500 transition-colors hover:border-white/[0.1] hover:text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <Search size={13} />
            <span>Search…</span>
          </div>
          <kbd>⌘K</kbd>
        </button>

        <nav>
          <ul className="sidebar-nav">
            {/* Overview */}
            <li className="sidebar-section-label">Overview</li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" className={({ isActive }) => (isActive ? "active" : "")}>
                <Kanban size={16} />
                <span>Pipeline</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
                <Briefcase size={16} />
                <span>Jobs</span>
              </NavLink>
            </li>

            {/* Tools */}
            <li className="sidebar-section-label">Tools</li>
            <li>
              <NavLink to="/resume" className={({ isActive }) => (isActive ? "active" : "")}>
                <FileText size={16} />
                <span>Resume</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cover-letter" className={({ isActive }) => (isActive ? "active" : "")}>
                <Send size={16} />
                <span>Cover Letter</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/interview-prep" className={({ isActive }) => (isActive ? "active" : "")}>
                <Bot size={16} />
                <span>Interview Prep</span>
              </NavLink>
            </li>

            {/* System */}
            <li className="sidebar-section-label">System</li>
            <li>
              <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
                <Settings size={16} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <User size={16} />
        </div>
        <div className="min-w-0">
          <p className="sidebar-name truncate">Ninad Panchal</p>
          <p className="sidebar-role truncate">Bengaluru, India</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
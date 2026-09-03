import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Home,
  User,
  Kanban,
  Send,
  Bot,
  Search,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
}

function Sidebar({ onOpenCommandPalette }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="sidebar-title">Career Companion</h2>
            <p className="sidebar-subtitle">AI Career Operating System</p>
          </div>
        </div>

        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="mb-5 flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-zinc-500" />
            <span>Search / Commands</span>
          </div>
          <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
            ⌘K
          </kbd>
        </button>

        <nav>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                <Home size={18} />
                <span>Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/applications" className={({ isActive }) => (isActive ? "active" : "")}>
                <Kanban size={18} />
                <span>Pipeline Tracker</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
                <Briefcase size={18} />
                <span>Discover Jobs</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/resume" className={({ isActive }) => (isActive ? "active" : "")}>
                <FileText size={18} />
                <span>Resume & ATS</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/cover-letter" className={({ isActive }) => (isActive ? "active" : "")}>
                <Send size={18} />
                <span>AI Cover Letter</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/interview-prep" className={({ isActive }) => (isActive ? "active" : "")}>
                <Bot size={18} />
                <span>Mock Interview</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
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
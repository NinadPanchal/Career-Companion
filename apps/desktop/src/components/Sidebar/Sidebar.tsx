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
import { GithubIcon } from "../ui/Icons";
import "./Sidebar.css";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
  isOpen?: boolean;
  onNavigate?: () => void;
}

function Sidebar({ onOpenCommandPalette, isOpen = false, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Application sidebar">
      <div>
        <div className="sidebar-brand">
          <NavLink
            to="/"
            onClick={onNavigate}
            className="group flex items-center justify-between transition-all"
            title="Return to Career Companion Overview"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-[10px] font-bold text-zinc-950 shadow-sm shadow-emerald-500/20">
                CC
              </span>
              <span className="sidebar-title">Career Companion</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors">
              v1.0
            </span>
          </NavLink>
        </div>

        {/* Command Search Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.14] px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer group"
          aria-label="Open command palette (Command + K)"
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            <span>Quick search...</span>
          </div>
          <kbd aria-hidden="true" className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400">⌘K</kbd>
        </button>

        <nav aria-label="Sidebar main navigation">
          <ul className="sidebar-nav">
            {/* Overview */}
            <li className="sidebar-section-label">Pipeline</li>
            <li>
              <NavLink to="/dashboard" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <Kanban size={15} />
                <span>Applications</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <Briefcase size={15} />
                <span>Job Board</span>
              </NavLink>
            </li>

            {/* Preparation Tools */}
            <li className="sidebar-section-label">Preparation</li>
            <li>
              <NavLink to="/resume" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <FileText size={15} />
                <span>Resume & ATS</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cover-letter" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <Send size={15} />
                <span>Cover Letters</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/interview-prep" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <Bot size={15} />
                <span>Interview Prep</span>
              </NavLink>
            </li>

            {/* System / Preferences */}
            <li className="sidebar-section-label">System</li>
            <li>
              <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => (isActive ? "active" : "")}>
                <Settings size={15} />
                <span>Settings & DB</span>
              </NavLink>
            </li>
            <li>
              <a
                href="https://github.com/NinadPanchal/Career-Companion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="GitHub repository (opens in new tab)"
              >
                <GithubIcon width={15} height={15} />
                <span>Source Code</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* User Profile Info */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar" aria-hidden="true">
          <User size={15} />
        </div>
        <div className="min-w-0">
          <p className="sidebar-name truncate">Ninad Panchal</p>
          <p className="sidebar-role truncate">B.E. AI & DS • Mumbai, India</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

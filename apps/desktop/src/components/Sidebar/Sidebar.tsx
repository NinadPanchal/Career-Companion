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
  Plus,
} from "lucide-react";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import "./Sidebar.css";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
  isOpen?: boolean;
  onNavigate?: () => void;
}

function Sidebar({ onOpenCommandPalette, isOpen = false, onNavigate }: SidebarProps) {
  const { file } = useResumeStore();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Application sidebar">
      <div className="flex flex-col gap-3">
        {/* Workspace Brand Header */}
        <div className="sidebar-brand">
          <NavLink
            to="/"
            onClick={onNavigate}
            className="flex items-center justify-between group"
            title="Return to Career Companion Overview"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#18181b] border border-white/[0.08] text-xs font-semibold text-[#10b981]">
                ⚡
              </span>
              <div>
                <span className="sidebar-title block leading-none font-semibold text-[#f4f4f5]">Career Companion</span>
                <span className="text-[11px] text-[#71717a] block mt-0.5">Desktop Assistant</span>
              </div>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#18181b] border border-white/[0.08] text-[#71717a]">
              ⌘K
            </kbd>
          </NavLink>
        </div>

        {/* Quick Search Action */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex w-full items-center justify-between rounded-[8px] border border-white/[0.08] bg-[#09090b] hover:bg-[#18181b] hover:border-white/[0.14] px-2.5 py-1.5 text-xs text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
          aria-label="Open command palette (Command + K)"
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="text-[#71717a]" />
            <span>Search workspace...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/[0.04] text-[#71717a]">⌘K</kbd>
        </button>

        {/* Quick Track Action Button */}
        <NavLink
          to="/applications"
          onClick={onNavigate}
          className="flex items-center justify-between h-8 px-2.5 rounded-[8px] bg-[#18181b] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-[#f4f4f5] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Plus size={13} className="text-[#10b981]" />
            <span>Track application</span>
          </span>
          <span className="text-[10px] font-mono text-[#71717a]">N</span>
        </NavLink>

        {/* Navigation Trees */}
        <nav aria-label="Sidebar main navigation">
          <div className="sidebar-section-label">Pipeline & Roles</div>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/dashboard" onClick={onNavigate} end>
                <LayoutDashboard size={14} />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" onClick={onNavigate}>
                <Briefcase size={14} />
                <span className="flex-1">Job Discovery</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" onClick={onNavigate}>
                <Kanban size={14} />
                <span>Application Pipeline</span>
              </NavLink>
            </li>
          </ul>

          <div className="sidebar-section-label">Tools</div>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/resume" onClick={onNavigate}>
                <FileText size={14} />
                <span>Resume & ATS</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cover-letter" onClick={onNavigate}>
                <Send size={14} />
                <span>Outreach Studio</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/interview-prep" onClick={onNavigate}>
                <Bot size={14} />
                <span>STAR Simulator</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" onClick={onNavigate}>
                <Settings size={14} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section: Active Resume Status & Profile */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
        {/* Active Resume Pill */}
        <NavLink
          to="/resume"
          onClick={onNavigate}
          className="p-2.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] flex flex-col gap-1 transition-colors"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#71717a]">Active resume</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Ready
            </span>
          </div>
          <span className="text-xs text-[#a1a1aa] truncate font-medium">
            {file?.name || "parsed_resume_v2.pdf"}
          </span>
        </NavLink>

        {/* Profile Card */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">NP</div>
          <div className="min-w-0 flex-1">
            <p className="sidebar-name truncate">Ninad Panchal</p>
            <p className="sidebar-role truncate">AI & DS Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;


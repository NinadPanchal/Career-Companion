import { useState, useEffect } from "react";
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
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import { Tooltip } from "../ui/Tooltip";
import { Button } from "../ui";
import "./Sidebar.css";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
  isOpen?: boolean;
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  onOpenCommandPalette,
  isOpen = false,
  onNavigate,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const { file } = useResumeStore();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const navItems = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: LayoutDashboard,
      section: "Pipeline & Roles",
      end: true,
    },
    {
      label: "Job Discovery",
      to: "/jobs",
      icon: Briefcase,
      section: "Pipeline & Roles",
    },
    {
      label: "Application Pipeline",
      to: "/applications",
      icon: Kanban,
      section: "Pipeline & Roles",
    },
    {
      label: "Resume & ATS",
      to: "/resume",
      icon: FileText,
      section: "Tools",
    },
    {
      label: "Outreach Studio",
      to: "/cover-letter",
      icon: Send,
      section: "Tools",
    },
    {
      label: "STAR Simulator",
      to: "/interview-prep",
      icon: Bot,
      section: "Tools",
    },
    {
      label: "Settings",
      to: "/settings",
      icon: Settings,
      section: "Tools",
    },
  ];

  const pipelineItems = navItems.filter((i) => i.section === "Pipeline & Roles");
  const toolItems = navItems.filter((i) => i.section === "Tools");

  return (
    <aside
      className={`sidebar-shell glass ${
        isCollapsed ? "sidebar-shell--collapsed" : ""
      } ${isOpen ? "sidebar-shell--open" : ""}`}
      aria-label="Application sidebar"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-3 min-w-0">
          {/* Header & Brand */}
          <div className="sidebar-brand-container">
            <NavLink
              to="/"
              onClick={onNavigate}
              className="flex items-center gap-2.5 overflow-hidden group py-1"
              title="Career Companion Home"
            >
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)] shrink-0 transition-transform group-hover:scale-105">
                <Sparkles size={16} />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden leading-tight">
                  <span className="block text-[var(--text-sm)] font-semibold text-[var(--text)] tracking-tight truncate">
                    Career Companion
                  </span>
                  <span className="block text-[11px] text-[var(--text-muted)] truncate">
                    Desktop Assistant
                  </span>
                </div>
              )}
            </NavLink>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={toggleCollapse}
              className="sidebar-collapse-trigger"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
            </Button>
          </div>

          {/* Quick Search Action */}
          <div className="px-1">
            {isCollapsed ? (
              <Tooltip content="Search workspace (⌘K)" position="right">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={onOpenCommandPalette}
                  className="w-9 h-9 mx-auto"
                  aria-label="Open command palette"
                >
                  <Search size={15} />
                </Button>
              </Tooltip>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onOpenCommandPalette}
                className="w-full h-9 px-3 justify-between font-normal text-[var(--text-muted)] hover:text-[var(--text)] text-[var(--text-xs)]"
                aria-label="Search workspace (⌘K)"
              >
                <div className="flex items-center gap-2">
                  <Search size={14} className="text-[var(--text-muted)]" />
                  <span>Search workspace...</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] font-mono text-[10px] text-[var(--text-muted)]">
                  ⌘K
                </kbd>
              </Button>
            )}
          </div>

          {/* Quick Track Action */}
          <div className="px-1">
            {isCollapsed ? (
              <Tooltip content="Track new application" position="right">
                <Button asChild variant="primary" size="icon-sm" className="w-9 h-9 mx-auto shadow-sm">
                  <NavLink
                    to="/applications"
                    onClick={onNavigate}
                    aria-label="Track new application"
                  >
                    <Plus size={16} />
                  </NavLink>
                </Button>
              </Tooltip>
            ) : (
              <Button asChild variant="primary" size="sm" className="w-full h-9 justify-between shadow-sm">
                <NavLink
                  to="/applications"
                  onClick={onNavigate}
                >
                  <span className="flex items-center gap-2">
                    <Plus size={14} />
                    <span>Track application</span>
                  </span>
                  <span className="font-mono text-[10px] opacity-75">N</span>
                </NavLink>
              </Button>
            )}
          </div>

          {/* Navigation Trees */}
          <nav className="flex flex-col gap-3 mt-1" aria-label="Sidebar navigation">
            {/* Pipeline Section */}
            <div>
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-[var(--text-faint)] uppercase">
                  Pipeline & Roles
                </div>
              )}
              <ul className="space-y-1">
                {pipelineItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      {isCollapsed ? (
                        <Tooltip content={item.label} position="right">
                          <NavLink
                            to={item.to}
                            onClick={onNavigate}
                            end={item.end}
                            className={({ isActive }) =>
                              `sidebar-nav-item ${
                                isActive ? "sidebar-nav-item--active" : ""
                              } justify-center`
                            }
                          >
                            <Icon size={18} className="shrink-0" />
                          </NavLink>
                        </Tooltip>
                      ) : (
                        <NavLink
                          to={item.to}
                          onClick={onNavigate}
                          end={item.end}
                          className={({ isActive }) =>
                            `sidebar-nav-item ${
                              isActive ? "sidebar-nav-item--active" : ""
                            }`
                          }
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tools Section */}
            <div>
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-[var(--text-faint)] uppercase">
                  Tools & Prep
                </div>
              )}
              <ul className="space-y-1">
                {toolItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      {isCollapsed ? (
                        <Tooltip content={item.label} position="right">
                          <NavLink
                            to={item.to}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                              `sidebar-nav-item ${
                                isActive ? "sidebar-nav-item--active" : ""
                              } justify-center`
                            }
                          >
                            <Icon size={18} className="shrink-0" />
                          </NavLink>
                        </Tooltip>
                      ) : (
                        <NavLink
                          to={item.to}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            `sidebar-nav-item ${
                              isActive ? "sidebar-nav-item--active" : ""
                            }`
                          }
                        >
                          <Icon size={18} className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Section: Active Resume & Profile */}
        <div className="pt-3 border-t border-[var(--divider)] flex flex-col gap-2">
          {/* Active Resume Pill */}
          {!isCollapsed ? (
            <NavLink
              to="/resume"
              onClick={onNavigate}
              className="p-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex flex-col gap-0.5 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[var(--text-muted)]">Active resume</span>
                <span className="inline-flex items-center gap-1 text-[var(--success)] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                  Ready
                </span>
              </div>
              <span className="text-[var(--text-xs)] text-[var(--text)] truncate font-medium">
                {file?.name || "parsed_resume_v2.pdf"}
              </span>
            </NavLink>
          ) : (
            <Tooltip content="Active Resume: Ready" position="right">
              <NavLink
                to="/resume"
                onClick={onNavigate}
                className="w-9 h-9 mx-auto rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--success)]"
              >
                <FileText size={16} />
              </NavLink>
            </Tooltip>
          )}

          {/* Profile Card */}
          <div className="sidebar-profile-card">
            <div className="sidebar-profile-avatar">NP</div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] truncate">
                  Ninad Panchal
                </p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">
                  AI & DS Engineer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

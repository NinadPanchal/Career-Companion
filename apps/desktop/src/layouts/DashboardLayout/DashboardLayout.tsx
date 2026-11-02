import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, Search, Plus, PanelLeftOpen } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const workspaceLabels: Record<string, string> = {
    "/dashboard": "Overview",
    "/applications": "Application Pipeline",
    "/jobs": "Job Discovery",
    "/resume": "Resume & ATS",
    "/cover-letter": "Outreach Studio",
    "/interview-prep": "STAR Simulator",
    "/settings": "Settings",
  };
  const pageLabel = workspaceLabels[location.pathname] ?? "Workspace";

  // Collapse sidebar automatically under 900px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Global Command+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="app-shell-root">
      {/* Mobile backdrop scrim */}
      <div
        className={`app-scrim ${isSidebarOpen ? "app-scrim--visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Floating Glass Sidebar (232px -> 64px collapsible) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Workspace Column */}
      <div className="app-main-column">
        {/* Top Glass Toolbar (52px per design.md Section 4) */}
        <header className="workspace-toolbar glass select-none">
          {/* Left: Mobile trigger & breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="mobile-nav-trigger"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
            >
              <Menu size={16} />
            </button>

            {isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg)] border border-transparent transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}

            <div className="flex items-center gap-2 text-[var(--text-sm)]">
              <span className="text-[var(--text-muted)] hidden sm:inline">
                Career Companion
              </span>
              <span className="text-[var(--divider)] hidden sm:inline">/</span>
              <span className="text-[var(--text)] font-semibold truncate">
                {pageLabel}
              </span>
            </div>
          </div>

          {/* Center: Search trigger */}
          <div className="hidden md:flex items-center relative w-72">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full h-8 pl-8 pr-10 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-left text-[var(--text-xs)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center transition-colors cursor-pointer"
            >
              <Search size={13} className="absolute left-2.5 text-[var(--text-muted)]" />
              <span className="truncate">Search commands, jobs, roles...</span>
              <kbd className="absolute right-2 px-1 py-0.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-[9px] font-mono text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle size="sm" />

            <Link
              to="/applications"
              className="h-8 px-3 rounded-[var(--radius-md)] bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] font-medium text-[var(--text-xs)] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
            >
              <Plus size={14} />
              <span>Track Job</span>
            </Link>
          </div>
        </header>

        {/* Main Workspace Scroll Area */}
        <main className="workspace-main-area">
          <div className="workspace-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;

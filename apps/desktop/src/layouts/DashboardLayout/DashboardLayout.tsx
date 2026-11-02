import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, Search, Plus, PanelLeftOpen } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import { Button } from "../../components/ui";
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="mobile-nav-trigger"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
            >
              <Menu size={16} />
            </Button>

            {isCollapsed && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:inline-flex text-[var(--text-muted)] hover:text-[var(--text)]"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={16} />
              </Button>
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
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full h-8 justify-between font-normal text-[var(--text-muted)] hover:text-[var(--text)] text-xs pl-8 pr-2 relative"
            >
              <Search size={13} className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none" />
              <span className="truncate">Search commands, jobs, roles...</span>
              <kbd className="px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-[9px] font-mono text-[var(--text-muted)] shrink-0">
                ⌘K
              </kbd>
            </Button>
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <ThemeToggle size="sm" />

            <Button asChild variant="primary" size="sm">
              <Link to="/applications">
                <Plus size={14} />
                <span>Track Job</span>
              </Link>
            </Button>
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

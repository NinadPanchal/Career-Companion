import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, PanelLeftClose, Search, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="app-shell">
      <div
        className={`sidebar-scrim ${isSidebarOpen ? "sidebar-scrim--visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <div className="app-main">
        {/* Top Control Bar (48px Restrained Header) */}
        <header className="workspace-header select-none">
          {/* Left: Breadcrumbs & Section Title */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
            >
              {isSidebarOpen ? <PanelLeftClose size={15} /> : <Menu size={15} />}
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#71717a]">Career Companion</span>
              <span className="text-[#71717a]/40">/</span>
              <span className="text-[#f4f4f5] font-medium">{pageLabel}</span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <div className="hidden md:flex items-center relative w-72">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full h-7 pl-7 pr-10 rounded-[6px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] text-left text-xs text-[#71717a] hover:text-[#a1a1aa] flex items-center transition-colors cursor-pointer"
            >
              <Search size={12} className="absolute left-2 text-[#71717a]" />
              <span className="truncate">Search commands, jobs, roles...</span>
              <kbd className="absolute right-1.5 px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-[9px] text-[#71717a] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Quick Action CTAs */}
          <div className="flex items-center gap-2">
            <Link
              to="/applications"
              className="h-7 px-2.5 rounded-[6px] bg-[#10b981] hover:bg-[#34d399] active:bg-[#059669] text-[#09090b] font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Track Job</span>
            </Link>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="workspace-content">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default DashboardLayout;

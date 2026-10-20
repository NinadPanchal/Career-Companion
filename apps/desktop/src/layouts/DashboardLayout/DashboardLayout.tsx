import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, PanelLeftClose } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";
import "./DashboardLayout.css";

function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const workspaceLabels: Record<string, string> = {
    "/dashboard": "Workspace",
    "/applications": "Applications",
    "/jobs": "Job discovery",
    "/resume": "Resume & ATS",
    "/cover-letter": "Cover letter studio",
    "/interview-prep": "Interview practice",
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
      <div className={`sidebar-scrim ${isSidebarOpen ? "sidebar-scrim--visible" : ""}`} onClick={() => setIsSidebarOpen(false)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <div className="app-main">
        {/* Top Control Bar (Clean Minimalist Glass) */}
        <header className="workspace-header select-none">
          {/* Left: Breadcrumbs & Subtle Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
            >
              {isSidebarOpen ? <PanelLeftClose size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500 font-medium">Workspace</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-200 font-semibold">{pageLabel}</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Neon Synced</span>
            </div>
          </div>

          {/* Center: Search Trigger Bar */}
          <div className="hidden md:flex items-center relative w-80">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full h-8.5 pl-9 pr-12 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] text-left text-xs text-zinc-400 flex items-center transition-all cursor-pointer group"
            >
              <span className="absolute left-3 text-zinc-500 group-hover:text-zinc-400 transition-colors text-xs">⌘</span>
              <span className="truncate">Search commands, pages, jobs...</span>
              <span className="absolute right-2 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-zinc-400 font-mono">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/jobs"
              className="hidden sm:inline-flex h-8 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.14] text-zinc-300 hover:text-white text-xs font-medium items-center gap-1.5 transition-all"
            >
              <span>Discover Jobs</span>
            </Link>
            <Link
              to="/applications"
              className="h-8 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-[0_2px_10px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              <span>+ Track Job</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="workspace-content">
          <div className="mx-auto w-full max-w-7xl">
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

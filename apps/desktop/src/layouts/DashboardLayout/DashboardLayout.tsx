import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import CommandPalette from "../../components/CommandPalette/CommandPalette";

function DashboardLayout() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <Sidebar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Top Control Bar (Stitch Design Specification) */}
        <header className="sticky top-0 z-30 h-12 flex items-center justify-between px-6 sm:px-10 lg:px-12 bg-[#09090b]/90 backdrop-blur border-b border-white/[0.08] select-none">
          {/* Left: Breadcrumbs & Live Sync Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="text-zinc-500">Project Overview</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-200 font-medium">Workspace</span>
            </div>
            <div className="h-3 w-px bg-white/[0.08]" />
            {/* Live Sync Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0f0f12] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Local Engine • Neon synced</span>
            </div>
          </div>

          {/* Center: Search Input Bar */}
          <div className="hidden md:flex items-center relative w-72">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full h-8 pl-8 pr-12 rounded bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] text-left text-xs text-zinc-400 flex items-center transition-colors"
            >
              <span className="absolute left-2.5 text-zinc-500 text-xs">⌘</span>
              <span>Filter applications or commands...</span>
              <span className="absolute right-2 px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-400 font-mono">
                ⌘K
              </span>
            </button>
          </div>

          {/* Right: Actions & Tools */}
          <div className="flex items-center gap-2">
            <a
              href="/jobs"
              className="h-7 px-3 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="text-xs">⚡</span>
              <span>Discover Jobs</span>
            </a>
            <a
              href="/applications"
              className="h-7 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <span>+ Track Job</span>
            </a>
            <div className="h-3 w-px bg-white/[0.08] mx-1" />
            <a
              href="https://github.com/NinadPanchal/Career-Companion"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="Documentation & Source"
            >
              <span className="text-xs font-mono">?</span>
            </a>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
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
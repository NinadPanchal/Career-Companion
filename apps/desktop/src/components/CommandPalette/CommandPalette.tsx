import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Kanban, 
  Send, 
  Bot, 
  Settings, 
  Sparkles, 
  Plus, 
  Wand2 
} from "lucide-react";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Action";
  icon: any;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { setIsAddModalOpen } = useApplicationsStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Go to Dashboard",
      category: "Navigation",
      icon: LayoutDashboard,
      action: () => { navigate("/dashboard"); onClose(); }
    },
    {
      id: "nav-apps",
      title: "Application Pipeline (Kanban)",
      category: "Navigation",
      icon: Kanban,
      action: () => { navigate("/applications"); onClose(); }
    },
    {
      id: "nav-jobs",
      title: "Discover Jobs (India & Remote)",
      category: "Navigation",
      icon: Briefcase,
      action: () => { navigate("/jobs"); onClose(); }
    },
    {
      id: "nav-resume",
      title: "Resume Manager & ATS Engine",
      category: "Navigation",
      icon: FileText,
      action: () => { navigate("/resume"); onClose(); }
    },
    {
      id: "nav-cover-letter",
      title: "AI Cover Letter & LinkedIn Outreach",
      category: "Navigation",
      icon: Send,
      action: () => { navigate("/cover-letter"); onClose(); }
    },
    {
      id: "nav-interview",
      title: "Mock Interview Simulator (STAR)",
      category: "Navigation",
      icon: Bot,
      action: () => { navigate("/interview-prep"); onClose(); }
    },
    {
      id: "nav-settings",
      title: "Settings & API Keys",
      category: "Navigation",
      icon: Settings,
      action: () => { navigate("/settings"); onClose(); }
    },
    // Quick Actions
    {
      id: "action-add-app",
      title: "Track New Job Application",
      category: "Quick Action",
      icon: Plus,
      action: () => {
        navigate("/applications");
        setIsAddModalOpen(true);
        onClose();
      }
    },
    {
      id: "action-bullet",
      title: "Optimize Resume Bullet Point (Google XYZ)",
      category: "Quick Action",
      icon: Wand2,
      action: () => {
        navigate("/resume");
        onClose();
      }
    },
    {
      id: "action-practice",
      title: "Practice Mock Interview Questions",
      category: "Quick Action",
      icon: Sparkles,
      action: () => {
        navigate("/interview-prep");
        onClose();
      }
    }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-4 pt-20 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0d12]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 text-white"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-white/[0.08] px-4.5 py-3.5">
              <Search size={16} className="mr-3 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, tools, pages..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
              />
              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.08] text-white border border-white/[0.08]"
                          : "text-zinc-300 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isSelected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.03] text-zinc-400"}`}>
                          <Icon size={14} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono tracking-wider ${
                        isSelected ? "text-emerald-400" : "text-zinc-500"
                      }`}>
                        {item.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-zinc-500">
                  No commands found matching "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/40 px-4 py-2.5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span>Navigate <kbd className="rounded border border-white/[0.08] bg-white/[0.05] px-1 py-0.2 font-mono">↑</kbd><kbd className="rounded border border-white/[0.08] bg-white/[0.05] px-1 py-0.2 font-mono">↓</kbd></span>
                <span className="text-zinc-700">•</span>
                <span>Select <kbd className="rounded border border-white/[0.08] bg-white/[0.05] px-1 py-0.2 font-mono">↵</kbd></span>
              </div>
              <span className="text-zinc-400 font-mono text-[10px]">Career Companion</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

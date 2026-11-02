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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20 backdrop-blur-[6px]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--glass-border)] glass glass--strong shadow-[var(--glass-shadow)] text-[var(--text)]"
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-[var(--divider)] px-3.5 py-3">
              <Search size={15} className="mr-2.5 text-[var(--text-muted)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="w-full bg-transparent text-[var(--text-sm)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none"
              />
              <span className="rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-[var(--radius-md)] px-2.5 py-2 text-left text-[var(--text-xs)] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--glass-bg-strong)] text-[var(--text)] border border-[var(--glass-border)] shadow-sm"
                          : "text-[var(--text-muted)] hover:bg-[var(--glass-bg)] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center ${isSelected ? "bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] text-[var(--accent)]" : "bg-[var(--glass-bg)] text-[var(--text-muted)]"}`}>
                          <Icon size={14} />
                        </div>
                        <span className="font-medium text-[var(--text-sm)]">{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono tracking-wider uppercase ${
                        isSelected ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                      }`}>
                        {item.category}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-[var(--text-xs)] text-[var(--text-muted)]">
                  No commands found matching "{query}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--divider)] bg-[var(--glass-bg)] px-3.5 py-2 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span>Navigate <kbd className="rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-1 py-0.5 font-mono text-[10px]">↑</kbd><kbd className="rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-1 py-0.5 font-mono text-[10px]">↓</kbd></span>
                <span className="text-[var(--divider)]">•</span>
                <span>Select <kbd className="rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-1 py-0.5 font-mono text-[10px]">↵</kbd></span>
              </div>
              <span className="text-[var(--text-faint)] font-mono text-[10px]">Career Companion</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

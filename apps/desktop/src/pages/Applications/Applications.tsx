import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Trash2, 
  Kanban as KanbanIcon, 
  Table as TableIcon, 
  MessageSquareText, 
  X,
  Timer,
  CheckCircle,
  FileText,
  SlidersHorizontal
} from "lucide-react";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { ApplicationItem, ApplicationStatusType } from "../../features/applications/services/applications.service";
import { Button } from "../../components/ui/Button";

interface ColumnDef {
  key: ApplicationStatusType;
  label: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  salaryTotal: string;
  count: number;
}

export default function Applications() {
  const { 
    applications, 
    fetchApplications, 
    updateStatus, 
    updateNotes, 
    deleteApplication, 
    addApplication,
    isAddModalOpen,
    setIsAddModalOpen 
  } = useApplicationsStore();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingApp, setEditingApp] = useState<ApplicationItem | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  // New Application Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatusType>("applied");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApps = applications.filter(app => {
    const title = app.job?.title || app.job_title || "";
    const company = app.job?.company_name || app.company_name || "";
    const search = searchTerm.toLowerCase();
    return title.toLowerCase().includes(search) || company.toLowerCase().includes(search);
  });

  const columns: ColumnDef[] = [
    { 
      key: "discovered", 
      label: "Wishlist / Discovered", 
      dotColor: "bg-zinc-500", 
      badgeBg: "bg-zinc-800/80 border-white/[0.08]", 
      badgeText: "text-zinc-400",
      salaryTotal: "₹81L",
      count: filteredApps.filter(a => a.status === "discovered").length || 4
    },
    { 
      key: "applied", 
      label: "Applied", 
      dotColor: "bg-sky-400", 
      badgeBg: "bg-sky-500/10 border-sky-500/20", 
      badgeText: "text-sky-400",
      salaryTotal: "₹68L+",
      count: filteredApps.filter(a => a.status === "applied").length || 6
    },
    { 
      key: "interview", 
      label: "Interviewing", 
      dotColor: "bg-amber-400", 
      badgeBg: "bg-amber-500/10 border-amber-500/20", 
      badgeText: "text-amber-400",
      salaryTotal: "High Priority",
      count: filteredApps.filter(a => a.status === "interview").length || 3
    },
    { 
      key: "offer", 
      label: "Offer Received", 
      dotColor: "bg-emerald-400", 
      badgeBg: "bg-emerald-500/10 border-emerald-500/20", 
      badgeText: "text-emerald-400",
      salaryTotal: "Action Req",
      count: filteredApps.filter(a => a.status === "offer").length || 1
    },
    { 
      key: "rejected", 
      label: "Archived / Rejected", 
      dotColor: "bg-rose-400", 
      badgeBg: "bg-rose-500/10 border-rose-500/20", 
      badgeText: "text-rose-400",
      salaryTotal: "Cooldown",
      count: filteredApps.filter(a => a.status === "rejected").length || 2
    }
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    addApplication({
      title: newTitle.trim(),
      company_name: newCompany.trim(),
      location: newLocation.trim() || "Mumbai, India",
      url: newUrl.trim(),
      status: newStatus,
      notes: newNotes.trim()
    });

    setNewTitle("");
    setNewCompany("");
    setNewLocation("");
    setNewUrl("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  const handleOpenNotes = (app: ApplicationItem) => {
    setEditingApp(app);
    setNotesDraft(app.notes || "");
  };

  const handleSaveNotes = () => {
    if (editingApp) {
      updateNotes(editingApp.id, notesDraft);
      setEditingApp(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in font-sans select-none">
      {/* ========================================================================= */}
      {/* TOP CONTROL BAR: Breadcrumbs, View Switcher & Action Cluster              */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08] shrink-0">
        {/* Left: Breadcrumb & Segmented View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <span>Applications</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-100 font-semibold">Active Kanban Pipeline</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08]" />
          
          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#0f0f12] border border-white/[0.08] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "kanban" 
                  ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <KanbanIcon size={13} />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "table" 
                  ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <TableIcon size={13} />
              <span>Table List</span>
            </button>
          </div>
        </div>

        {/* Right: Search, Filter, Add Job Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by company, role, or tag"
              className="h-8 pl-8 pr-12 rounded-lg bg-[#0f0f12] border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64 transition-colors"
            />
            <kbd className="absolute right-2 px-1.5 py-0.2 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[10px] font-mono">
              /
            </kbd>
          </div>

          <button
            type="button"
            className="h-8 px-2.5 bg-[#0f0f12] hover:bg-white/[0.04] text-zinc-300 hover:text-white border border-white/[0.08] rounded-lg flex items-center gap-1.5 text-xs transition-colors"
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} />
            <span>+ Track New Job</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE AGGREGATES SUBBAR                                                   */}
      {/* ========================================================================= */}
      <div className="h-9 px-1 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{filteredApps.length || 16} ACTIVE RECORDS</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span>TOTAL PIPELINE VALUE: <span className="text-zinc-200 font-semibold">₹1.95 Cr</span></span>
          <span className="text-zinc-600">•</span>
          <span>ESTIMATED OFFERS: <span className="text-emerald-400 font-semibold">1 Pending</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="hover:text-zinc-200 transition-colors">Sort: Last Activity</button>
          <span>•</span>
          <button className="hover:text-zinc-200 transition-colors">Group: Stage</button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KANBAN / TABLE VIEW BODY                                                  */}
      {/* ========================================================================= */}
      {viewMode === "kanban" ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden py-3">
          <div className="flex gap-3 h-full min-w-max pb-1">
            {columns.map(col => {
              const colApps = filteredApps.filter(a => a.status === col.key);
              
              return (
                <section 
                  key={col.key} 
                  className="w-80 flex flex-col bg-[#0f0f12] rounded-xl border border-white/[0.08] h-full"
                >
                  {/* Column Header */}
                  <div className="p-2.5 px-3 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0f0f12] rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor} ${col.key === "interview" ? "animate-pulse" : ""}`} />
                      <h2 className="text-xs font-semibold text-zinc-200">{col.label}</h2>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${col.badgeBg} ${col.badgeText}`}>
                        {colApps.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <span className="text-[10px] font-mono">{col.salaryTotal}</span>
                      <button
                        onClick={() => {
                          setNewStatus(col.key);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
                        title="Add to column"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Column Cards Container */}
                  <div className="p-2 flex-1 overflow-y-auto flex flex-col gap-2">
                    {colApps.map(app => {
                      const title = app.job?.title || app.job_title || "Software Engineer";
                      const company = app.job?.company_name || app.company_name || "Tech Corp";
                      const salary = app.salary_range || "₹30L - ₹42L";
                      const monogram = company.slice(0, 2).toUpperCase();

                      return (
                        <article
                          key={app.id}
                          className="p-3 bg-[#18181b]/60 border border-white/[0.06] hover:border-white/[0.14] rounded-lg flex flex-col gap-2.5 transition-all duration-150 cursor-pointer group shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-zinc-200 text-[11px] font-mono">
                                {monogram}
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors truncate">
                                  {company}
                                </h3>
                                <p className="text-[11px] text-zinc-400 truncate">{title}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenNotes(app)}
                                className="p-1 text-zinc-400 hover:text-white"
                                title="Edit notes"
                              >
                                <MessageSquareText size={13} />
                              </button>
                              <button
                                onClick={() => deleteApplication(app.id)}
                                className="p-1 text-zinc-500 hover:text-rose-400"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-200 font-medium">{salary}</span>
                            <span className="text-[10px] text-zinc-500">
                              {new Date(app.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>

                          {/* Stage Specific Context Telemetry */}
                          {col.key === "interview" && (
                            <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-zinc-300 flex items-center gap-1">
                                  <Timer size={11} className="text-amber-400" />
                                  Round 2: System Design
                                </span>
                                <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                  Tomorrow 2:30 PM
                                </span>
                              </div>
                              {app.notes && (
                                <p className="text-[10px] text-zinc-400 italic bg-[#09090b] p-1.5 rounded border border-white/[0.04] line-clamp-2">
                                  "{app.notes}"
                                </p>
                              )}
                            </div>
                          )}

                          {col.key === "offer" && (
                            <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="text-emerald-400 font-semibold">Offer Review: 3 days left</span>
                                <span className="text-zinc-400">Base + Stock</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => alert("Offer letter preview")}
                                  className="h-6 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-[10px] font-mono border border-white/[0.06] flex items-center justify-center gap-1"
                                >
                                  <FileText size={11} />
                                  <span>Letter PDF</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => alert("Offer Accepted!")}
                                  className="h-6 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-[10px] font-mono flex items-center justify-center gap-1"
                                >
                                  <CheckCircle size={11} />
                                  <span>Accept</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {col.key === "rejected" && (
                            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Cooldown 6 mos
                              </span>
                              <span>Rounds: 5/5</span>
                            </div>
                          )}

                          {/* Column Status Transition Controls */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-[10px] text-zinc-500 font-mono">
                            <span>Move to:</span>
                            <div className="flex items-center gap-1">
                              {columns.filter(c => c.key !== col.key).map(c => (
                                <button
                                  key={c.key}
                                  onClick={() => updateStatus(app.id, c.key)}
                                  className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                                  title={`Move to ${c.label}`}
                                >
                                  {c.key[0].toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>
                        </article>
                      );
                    })}

                    {colApps.length === 0 && (
                      <div className="border border-dashed border-white/[0.08] rounded-lg p-4 flex flex-col items-center justify-center text-center gap-1 text-zinc-500 text-xs">
                        <span>No records in {col.label}</span>
                        <button
                          onClick={() => {
                            setNewStatus(col.key);
                            setIsAddModalOpen(true);
                          }}
                          className="text-emerald-400 hover:underline text-[11px] font-mono mt-1"
                        >
                          + Add Record
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="flex-1 overflow-y-auto py-3">
          <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181b] border-b border-white/[0.08] text-zinc-400 text-[11px] font-mono uppercase">
                <tr>
                  <th className="p-3">Company & Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Compensation</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-zinc-200">{app.job?.company_name || app.company_name}</div>
                      <div className="text-[11px] text-zinc-400">{app.job?.title || app.job_title}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400 font-mono text-[11px]">{app.job?.location || "Mumbai, India"}</td>
                    <td className="p-3 font-mono text-zinc-200 font-medium">{app.salary_range || "₹32L - ₹45L"}</td>
                    <td className="p-3 text-zinc-400 max-w-xs truncate">{app.notes || "—"}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenNotes(app)}
                          className="p-1 rounded text-zinc-400 hover:text-white"
                          title="Notes"
                        >
                          <MessageSquareText size={14} />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FOOTER STATUS & TELEMETRY STRIP                                           */}
      {/* ========================================================================= */}
      <footer className="h-7 border-t border-white/[0.08] px-2 flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Engine: Sync Latency 14ms</span>
          </span>
          <span>•</span>
          <span>DB: Local SQLite / Neon (Encrypted)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-zinc-500">
          <span><kbd className="px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.08]">Space</kbd> Quick Preview</span>
          <span><kbd className="px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.08]">E</kbd> Edit Target</span>
          <span><kbd className="px-1 py-0.2 rounded bg-white/[0.04] border border-white/[0.08]">J/K</kbd> Column Navigate</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* ADD APPLICATION MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0f0f12] p-6 shadow-2xl font-sans"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Track New Opportunity</h3>
                  <p className="text-xs text-zinc-400">Add an external position to your recruitment pipeline.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zepto, Razorpay, BrowserStack"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Remote"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">Pipeline Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatusType)}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      <option value="discovered">Wishlist / Discovered</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interviewing</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Archived / Rejected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Job URL / Portal Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Notes & Interview Details</label>
                  <textarea
                    rows={3}
                    placeholder="Add recruiter details, compensation targets, referral notes..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold">
                    Add to Pipeline
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* EDIT NOTES MODAL                                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0f0f12] p-6 shadow-2xl font-sans"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {editingApp.job?.title || editingApp.job_title}
                  </h3>
                  <p className="text-xs text-emerald-400">
                    {editingApp.job?.company_name || editingApp.company_name}
                  </p>
                </div>
                <button
                  onClick={() => setEditingApp(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <label className="mb-2 block text-xs font-semibold text-zinc-300">
                Application Notes & Interview Timeline
              </label>
              <textarea
                rows={5}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add interview dates, key questions asked, salary offer details, or follow-up actions..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-3 text-xs text-white outline-none focus:border-emerald-500 resize-none"
              />

              <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <Button variant="secondary" size="sm" onClick={() => setEditingApp(null)}>
                  Cancel
                </Button>
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold" onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

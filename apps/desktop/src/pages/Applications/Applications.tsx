import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  Filter, 
  Kanban as KanbanIcon, 
  List as ListIcon, 
  MessageSquareText, 
  X
} from "lucide-react";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { ApplicationItem, ApplicationStatusType } from "../../features/applications/services/applications.service";
import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";

const COLUMNS: { key: ApplicationStatusType; label: string; color: string; border: string; bg: string }[] = [
  { key: "discovered", label: "Wishlist / Discovered", color: "text-zinc-400", border: "border-zinc-800", bg: "bg-zinc-900/40" },
  { key: "applied", label: "Applied", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
  { key: "interview", label: "Interviewing", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
  { key: "offer", label: "Offer Received", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
  { key: "rejected", label: "Archived / Rejected", color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" }
];

export default function Applications() {
  const { 
    applications, 
    isLoading, 
    fetchApplications, 
    updateStatus, 
    updateNotes, 
    deleteApplication, 
    addApplication,
    isAddModalOpen,
    setIsAddModalOpen 
  } = useApplicationsStore();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Sparkles size={14} /> Pipeline Management
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Application Tracker</h1>
          <p className="mt-1 text-zinc-400">Track and manage your recruitment pipeline with live status updates.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "kanban" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <KanbanIcon size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ListIcon size={14} /> Table
            </button>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} /> Track New Job
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-indigo-500/50 focus:bg-zinc-900"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Filter size={14} />
          <span>Showing <strong className="text-white">{filteredApps.length}</strong> active applications</span>
        </div>
      </div>

      {/* Main Board */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-96 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4" />
          ))}
        </div>
      ) : viewMode === "kanban" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COLUMNS.map((col) => {
            const columnApps = filteredApps.filter(a => a.status === col.key);
            return (
              <div 
                key={col.key} 
                className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-4 backdrop-blur-md min-h-[500px]`}
              >
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                  </div>
                  <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-semibold text-zinc-300">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex flex-1 flex-col gap-3">
                  {columnApps.map((app) => {
                    const title = app.job?.title || app.job_title || "Untitled Role";
                    const company = app.job?.company_name || app.company_name || "Company";
                    const location = app.job?.location || "India";

                    return (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <Card hover className="group relative border-zinc-800 bg-zinc-900/80 p-4 transition-all hover:border-zinc-700">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-zinc-600 opacity-0 transition hover:text-rose-400 group-hover:opacity-100"
                              title="Delete application"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <p className="text-xs font-semibold text-indigo-400 line-clamp-1">{company}</p>
                          <p className="mt-1 text-[11px] text-zinc-500">{location}</p>

                          {app.match_score && (
                            <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2.5">
                              <span className="text-[11px] text-zinc-400">Match Score</span>
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                                {app.match_score}%
                              </span>
                            </div>
                          )}

                          {/* Quick Notes preview */}
                          {app.notes && (
                            <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2 italic bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-800/40">
                              "{app.notes}"
                            </p>
                          )}

                          {/* Action footer */}
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800/40">
                            <button
                              onClick={() => handleOpenNotes(app)}
                              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
                            >
                              <MessageSquareText size={12} /> Notes
                            </button>

                            {/* Move status dropdown */}
                            <select
                              value={app.status}
                              onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatusType)}
                              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] font-medium text-zinc-300 outline-none hover:border-zinc-700"
                            >
                              <option value="discovered">Discovered</option>
                              <option value="applied">Applied</option>
                              <option value="interview">Interviewing</option>
                              <option value="offer">Offer</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {columnApps.length === 0 && (
                    <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-800/60 p-6 text-center text-xs text-zinc-600">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card className="overflow-hidden border-zinc-800 bg-zinc-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Role & Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4">Notes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="transition hover:bg-zinc-800/30">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{app.job?.title || app.job_title || "Role"}</div>
                      <div className="text-xs text-indigo-400">{app.job?.company_name || app.company_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatusType)}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-zinc-200 capitalize"
                      >
                        <option value="discovered">Discovered</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        {app.match_score || 85}%
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-xs text-zinc-400">
                      {app.notes || "No notes"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenNotes(app)}
                          className="rounded p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                          <MessageSquareText size={16} />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Application Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Track New Job Application</h2>
                    <p className="text-xs text-zinc-400">Add an external application to your pipeline.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Architect"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India / Zerodha"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Remote"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatusType)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white outline-none focus:border-indigo-500"
                    >
                      <option value="discovered">Discovered / Wishlist</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interviewing</option>
                      <option value="offer">Offer Received</option>
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
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Notes / Recruiter Contact</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Referral via LinkedIn, recruiter mentioned base pay is 30 LPA..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add to Pipeline
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Notes Modal */}
      <AnimatePresence>
        {editingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingApp.job?.title || editingApp.job_title}
                  </h3>
                  <p className="text-xs text-indigo-400">
                    {editingApp.job?.company_name || editingApp.company_name}
                  </p>
                </div>
                <button
                  onClick={() => setEditingApp(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:border-indigo-500 resize-none"
              />

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditingApp(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes}>
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

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
  Building,
  MapPin,
} from "lucide-react";
import "./Applications.css";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { ApplicationItem, ApplicationStatusType } from "../../features/applications/services/applications.service";
import { Button, Badge, Tabs } from "../../components/ui";

interface ColumnDef {
  key: ApplicationStatusType;
  label: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
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
      label: "Wishlist", 
      dotColor: "bg-zinc-400", 
      badgeBg: "bg-zinc-500/10 border-zinc-500/20", 
      badgeText: "text-zinc-400",
    },
    { 
      key: "applied", 
      label: "Applied", 
      dotColor: "bg-sky-400", 
      badgeBg: "bg-sky-500/10 border-sky-500/20", 
      badgeText: "text-sky-400",
    },
    { 
      key: "interview", 
      label: "Interviewing", 
      dotColor: "bg-amber-400", 
      badgeBg: "bg-amber-500/10 border-amber-500/20", 
      badgeText: "text-amber-400",
    },
    { 
      key: "offer", 
      label: "Offer", 
      dotColor: "bg-emerald-400", 
      badgeBg: "bg-emerald-500/10 border-emerald-500/20", 
      badgeText: "text-emerald-400",
    },
    { 
      key: "rejected", 
      label: "Archived", 
      dotColor: "bg-rose-400", 
      badgeBg: "bg-rose-500/10 border-rose-500/20", 
      badgeText: "text-rose-400",
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
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in font-sans select-none">
      {/* ========================================================================= */}
      {/* HEADER & VIEW CONTROLS                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Application Pipeline</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
              {filteredApps.length} tracked
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage your active recruitment stages and company dialogues.</p>
        </div>

        {/* Controls: Search, View Mode, New Job */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center w-52 sm:w-64">
            <Search size={14} className="absolute left-3 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter company or role..."
              className="h-8.5 w-full pl-9 pr-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          <Tabs
            size="sm"
            tabs={[
              { id: "kanban", label: "Kanban", icon: <KanbanIcon size={13} /> },
              { id: "table", label: "Table", icon: <TableIcon size={13} /> },
            ]}
            activeTab={viewMode}
            onChange={(tab) => setViewMode(tab as "kanban" | "table")}
          />

          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5"
          >
            <Plus size={14} />
            <span>Track Job</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KANBAN / TABLE VIEW BODY                                                  */}
      {/* ========================================================================= */}
      {viewMode === "kanban" ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden py-4">
          <div className="flex gap-4 h-full min-w-max pb-1">
            {columns.map(col => {
              const colApps = filteredApps.filter(a => a.status === col.key);
              
              return (
                <section 
                  key={col.key} 
                  className="w-80 flex flex-col bg-[#0b0c10]/80 rounded-2xl border border-white/[0.07] h-full backdrop-blur-md"
                >
                  {/* Column Header */}
                  <div className="p-3.5 px-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor} ${col.key === "interview" ? "animate-pulse" : ""}`} />
                      <h2 className="text-xs font-semibold text-zinc-200">{col.label}</h2>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${col.badgeBg} ${col.badgeText}`}>
                        {colApps.length}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setNewStatus(col.key);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      title={`Add application to ${col.label}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Scrollable Column Cards Container */}
                  <div className="p-2.5 flex-1 overflow-y-auto flex flex-col gap-2.5">
                    {colApps.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-36 text-center p-4 rounded-xl border border-dashed border-white/[0.06] text-zinc-600">
                        <Building size={18} className="mb-1.5 opacity-50" />
                        <span className="text-xs">No applications</span>
                        <span className="text-[10px] text-zinc-700 mt-0.5">Click + to add</span>
                      </div>
                    ) : (
                      colApps.map(app => {
                        const title = app.job?.title || app.job_title || "Software Engineer";
                        const company = app.job?.company_name || app.company_name || "Company";
                        const salary = app.salary_range || "₹30L - ₹45L";
                        const location = app.job?.location || "Mumbai, India";
                        const monogram = company.slice(0, 2).toUpperCase();

                        return (
                          <article
                            key={app.id}
                            className="p-3.5 bg-[#12141a]/70 hover:bg-[#161820] border border-white/[0.07] hover:border-white/[0.14] rounded-xl flex flex-col gap-3 transition-all duration-150 group shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center font-bold text-zinc-200 text-[11px] font-mono shrink-0">
                                  {monogram}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-xs font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                                    {title}
                                  </h3>
                                  <p className="text-[11px] text-zinc-400 truncate">{company}</p>
                                </div>
                              </div>

                              {app.match_score && (
                                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                  {app.match_score}%
                                </span>
                              )}
                            </div>

                            {/* Meta: Location and Salary */}
                            <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                              <span className="flex items-center gap-1 truncate">
                                <MapPin size={11} className="shrink-0 text-zinc-600" />
                                <span className="truncate">{location}</span>
                              </span>
                              <span>•</span>
                              <span className="text-zinc-400 truncate">{salary}</span>
                            </div>

                            {/* Notes Snippet */}
                            {app.notes && (
                              <p className="text-[11px] text-zinc-400 line-clamp-1 italic bg-white/[0.02] p-1.5 rounded-lg border border-white/[0.04]">
                                "{app.notes}"
                              </p>
                            )}

                            {/* Bottom Card Actions & Quick Status Changer */}
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                              <select
                                value={app.status}
                                onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatusType)}
                                className="h-6 px-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-300 outline-none hover:border-white/[0.16] cursor-pointer"
                              >
                                <option value="discovered" className="bg-zinc-900 text-white">Wishlist</option>
                                <option value="applied" className="bg-zinc-900 text-white">Applied</option>
                                <option value="interview" className="bg-zinc-900 text-white">Interviewing</option>
                                <option value="offer" className="bg-zinc-900 text-white">Offer</option>
                                <option value="rejected" className="bg-zinc-900 text-white">Archived</option>
                              </select>

                              <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => handleOpenNotes(app)}
                                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  title="Add/Edit Notes"
                                >
                                  <MessageSquareText size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteApplication(app.id)}
                                  className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Remove Application"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="flex-1 overflow-y-auto py-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d12]/80 backdrop-blur-md overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3.5 pl-4">Company & Role</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Salary Range</th>
                  <th className="p-3.5">Notes</th>
                  <th className="p-3.5 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3.5 pl-4">
                      <div className="font-semibold text-white">{app.job?.title || app.job_title}</div>
                      <div className="text-[11px] text-zinc-400">{app.job?.company_name || app.company_name}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={app.status} size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-zinc-400 font-mono text-[11px]">{app.job?.location || "Mumbai, India"}</td>
                    <td className="p-3.5 font-mono text-zinc-300">{app.salary_range || "₹32L - ₹45L"}</td>
                    <td className="p-3.5 text-zinc-400 max-w-xs truncate">{app.notes || "—"}</td>
                    <td className="p-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenNotes(app)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Notes"
                        >
                          <MessageSquareText size={14} />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
      {/* ADD APPLICATION MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0d0e13] p-6 shadow-2xl text-white font-sans"
            >
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">Track New Opportunity</h3>
                  <p className="text-xs text-zinc-400">Add an external position to your pipeline.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white cursor-pointer"
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
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zepto, Razorpay, CRED"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
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
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-300">Pipeline Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatusType)}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <option value="discovered">Wishlist</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interviewing</option>
                      <option value="offer">Offer Received</option>
                      <option value="rejected">Archived</option>
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
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-300">Notes & Interview Details</label>
                  <textarea
                    rows={3}
                    placeholder="Recruiter contact, compensation target, referral notes..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 resize-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Save Application
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0d0e13] p-6 shadow-2xl text-white font-sans"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Application Notes</h3>
                  <p className="text-xs text-zinc-400">{editingApp.job?.company_name || editingApp.company_name}</p>
                </div>
                <button
                  onClick={() => setEditingApp(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <textarea
                rows={5}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Log interview feedback, recruiter discussions, next steps..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500 resize-none"
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingApp(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveNotes}
                >
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

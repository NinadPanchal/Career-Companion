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
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden py-3">
          <div className="flex gap-3.5 h-full min-w-full xl:min-w-0 pb-1">
            {columns.map(col => {
              const colApps = filteredApps.filter(a => a.status === col.key);
              
              return (
                <section 
                  key={col.key} 
                  className="flex-1 min-w-[210px] max-w-[300px] flex flex-col bg-[#0f0f12] rounded-[10px] border border-white/[0.08] h-full"
                >
                  {/* Column Header */}
                  <div className="p-3 px-3.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor} ${col.key === "interview" ? "animate-pulse" : ""}`} />
                      <h2 className="text-xs font-semibold text-[#f4f4f5]">{col.label}</h2>
                      <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-[4px] border ${col.badgeBg} ${col.badgeText}`}>
                        {colApps.length}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setNewStatus(col.key);
                        setIsAddModalOpen(true);
                      }}
                      className="p-1 rounded-[6px] hover:bg-white/[0.06] text-[#71717a] hover:text-white transition-colors cursor-pointer"
                      title={`Add application to ${col.label}`}
                      aria-label={`Add application to ${col.label}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Scrollable Column Cards Container */}
                  <div className="p-2.5 flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5">
                    {colApps.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center p-3 rounded-[8px] border border-dashed border-white/[0.06] text-[#71717a]">
                        <Building size={16} className="mb-1.5 opacity-40" />
                        <span className="text-xs">No applications</span>
                        <span className="text-[11px] text-[#52525b] mt-0.5">Click + to add</span>
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
                            className="p-3 bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.16] rounded-[8px] flex flex-col gap-2.5 transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[5px] bg-[#18181b] border border-white/[0.08] flex items-center justify-center font-bold text-[#f4f4f5] text-[10px] font-mono shrink-0">
                                  {monogram}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-xs font-semibold text-[#f4f4f5] truncate group-hover:text-[#10b981] transition-colors">
                                    {title}
                                  </h3>
                                  <p className="text-[11px] text-[#a1a1aa] truncate">{company}</p>
                                </div>
                              </div>

                              {app.match_score && (
                                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-[4px] bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 shrink-0">
                                  {app.match_score}%
                                </span>
                              )}
                            </div>

                            {/* Meta: Location and Salary */}
                            <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                              <span className="flex items-center gap-1 truncate max-w-[110px]">
                                <MapPin size={10} className="shrink-0 text-[#71717a]" />
                                <span className="truncate">{location}</span>
                              </span>
                              <span className="text-[#a1a1aa] font-mono shrink-0">{salary}</span>
                            </div>

                            {/* Notes Snippet */}
                            {app.notes && (
                              <p
                                onClick={() => handleOpenNotes(app)}
                                className="text-[11px] text-[#a1a1aa] line-clamp-2 italic bg-white/[0.02] p-1.5 rounded-[6px] border border-white/[0.04] cursor-pointer hover:border-white/[0.12] transition-colors"
                                title="Click to view or edit notes"
                              >
                                "{app.notes}"
                              </p>
                            )}

                            {/* Bottom Card Actions: Quick Status Changer & Controls */}
                            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                              <select
                                value={app.status}
                                onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatusType)}
                                className="h-6 px-1.5 rounded-[4px] bg-[#18181b] border border-white/[0.08] text-[10px] text-[#d4d4d8] outline-none hover:border-white/[0.16] focus:border-[#10b981] cursor-pointer"
                                aria-label="Change status"
                              >
                                <option value="discovered" className="bg-[#09090b] text-white">Wishlist</option>
                                <option value="applied" className="bg-[#09090b] text-white">Applied</option>
                                <option value="interview" className="bg-[#09090b] text-white">Interviewing</option>
                                <option value="offer" className="bg-[#09090b] text-white">Offer</option>
                                <option value="rejected" className="bg-[#09090b] text-white">Archived</option>
                              </select>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenNotes(app)}
                                  className="p-1 rounded-[4px] text-[#71717a] hover:text-[#f4f4f5] hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  title="Add/Edit notes"
                                  aria-label="Edit notes"
                                >
                                  <MessageSquareText size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteApplication(app.id)}
                                  className="p-1 rounded-[4px] text-[#71717a] hover:text-[#f43f5e] hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Remove application"
                                  aria-label="Delete application"
                                >
                                  <Trash2 size={12} />
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
        <div className="flex-1 overflow-y-auto py-3">
          <div className="rounded-[10px] border border-white/[0.08] bg-[#0f0f12] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-[#09090b] text-[#a1a1aa] text-[11px] font-medium">
                <tr>
                  <th className="p-3 pl-4">Company & role</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Salary range</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-semibold text-[#f4f4f5]">{app.job?.title || app.job_title}</div>
                      <div className="text-[11px] text-[#a1a1aa]">{app.job?.company_name || app.company_name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={app.status} size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#a1a1aa] text-[11px]">{app.job?.location || "Mumbai, India"}</td>
                    <td className="p-3 font-mono text-[#d4d4d8] text-[11px]">{app.salary_range || "₹32L - ₹45L"}</td>
                    <td className="p-3 text-[#71717a] max-w-xs truncate">{app.notes || "—"}</td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenNotes(app)}
                          className="p-1.5 rounded-[6px] text-[#71717a] hover:text-[#f4f4f5] hover:bg-white/[0.06] transition-colors cursor-pointer"
                          title="Notes"
                          aria-label="Notes"
                        >
                          <MessageSquareText size={13} />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1.5 rounded-[6px] text-[#71717a] hover:text-[#f43f5e] hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg rounded-[12px] border border-white/[0.16] bg-[#18181b] p-5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] text-[#f4f4f5] font-sans"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#f4f4f5]">Track New Opportunity</h3>
                  <p className="text-xs text-[#71717a]">Add an external position to your pipeline.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-[6px] p-1.5 text-[#71717a] hover:bg-white/[0.06] hover:text-[#f4f4f5] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-[#a1a1aa]">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[#a1a1aa]">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Razorpay"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-[#a1a1aa]">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Remote"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[#a1a1aa]">Pipeline Stage</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatusType)}
                      className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] outline-none focus:border-[#10b981] transition-colors cursor-pointer"
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
                  <label className="mb-1 block text-xs text-[#a1a1aa]">Job URL / Portal Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-[#a1a1aa]">Notes & Interview Details</label>
                  <textarea
                    rows={3}
                    placeholder="Recruiter contact, compensation target, referral notes..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] resize-none transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md rounded-[12px] border border-white/[0.08] bg-[#18181b] p-5 shadow-2xl text-[#f4f4f5] font-sans"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-xs font-semibold text-[#f4f4f5]">Application Notes</h3>
                  <p className="text-[11px] text-[#71717a]">{editingApp.job?.company_name || editingApp.company_name}</p>
                </div>
                <button
                  onClick={() => setEditingApp(null)}
                  className="rounded-[6px] p-1 text-[#71717a] hover:bg-white/[0.06] hover:text-[#f4f4f5] transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <textarea
                rows={5}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Log interview feedback, recruiter discussions, next steps..."
                className="w-full rounded-[8px] border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] resize-none transition-colors"
              />

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
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

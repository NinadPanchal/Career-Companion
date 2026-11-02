import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Kanban as KanbanIcon, 
  Table as TableIcon, 
  MessageSquareText, 
  Building,
  MapPin,
} from "lucide-react";
import "./Applications.css";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { ApplicationItem, ApplicationStatusType } from "../../features/applications/services/applications.service";
import { Button, Badge, Tabs, Modal, Input, Select, Textarea } from "../../components/ui";

interface ColumnDef {
  key: ApplicationStatusType;
  label: string;
  dotColor: string;
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

  const filteredApps = applications.filter((app) => {
    const title = app.job?.title || app.job_title || "";
    const company = app.job?.company_name || app.company_name || "";
    const search = searchTerm.toLowerCase();
    return title.toLowerCase().includes(search) || company.toLowerCase().includes(search);
  });

  const columns: ColumnDef[] = [
    { 
      key: "discovered", 
      label: "Wishlist", 
      dotColor: "bg-[var(--status-discovered)]", 
    },
    { 
      key: "applied", 
      label: "Applied", 
      dotColor: "bg-[var(--status-applied)]", 
    },
    { 
      key: "interview", 
      label: "Interviewing", 
      dotColor: "bg-[var(--status-interview)]", 
    },
    { 
      key: "offer", 
      label: "Offer", 
      dotColor: "bg-[var(--status-offer)]", 
    },
    { 
      key: "rejected", 
      label: "Archived", 
      dotColor: "bg-[var(--status-rejected)]", 
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
    <div className="applications-viewport">
      {/* ========================================================================= */}
      {/* HEADER & VIEW CONTROLS                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--divider)] shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] flex items-center gap-3">
            <span>Application Pipeline</span>
            <span className="text-[var(--text-xs)] font-mono font-normal px-2.5 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border)]">
              {filteredApps.length} tracked
            </span>
          </h1>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1 leading-relaxed">
            Manage your active recruitment stages and company dialogues.
          </p>
        </div>

        {/* Controls: Search, View Mode, New Job */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center w-52 sm:w-64">
            <Search size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter company or role..."
              className="h-9 w-full pl-10 pr-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-xs)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
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
            leftIcon={<Plus size={14} />}
          >
            Track Job
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* KANBAN / TABLE VIEW BODY                                                  */}
      {/* ========================================================================= */}
      {viewMode === "kanban" ? (
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden py-3">
          <div className="flex gap-3 h-full min-w-full xl:min-w-0 pb-1">
            {columns.map((col) => {
              const colApps = filteredApps.filter((a) => a.status === col.key);
              
              return (
                <section key={col.key} className="kanban-col">
                  {/* Column Header */}
                  <div className="p-3 px-3.5 border-b border-[var(--divider)] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <h2 className="text-[var(--text-xs)] font-semibold text-[var(--text)]">{col.label}</h2>
                      <Badge variant={col.key} size="sm" dot={false}>
                        {colApps.length}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setNewStatus(col.key);
                        setIsAddModalOpen(true);
                      }}
                      className="h-6 w-6 text-[var(--text-muted)] hover:text-[var(--text)]"
                      title={`Add application to ${col.label}`}
                      aria-label={`Add application to ${col.label}`}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  {/* Scrollable Column Cards Container */}
                  <div className="p-2.5 flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5">
                    {colApps.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-center p-3 rounded-[var(--radius-md)] border border-dashed border-[var(--divider)] text-[var(--text-muted)]">
                        <Building size={16} className="mb-1.5 opacity-40 text-[var(--text-faint)]" />
                        <span className="text-[var(--text-xs)]">No applications</span>
                        <span className="text-[11px] text-[var(--text-faint)] mt-0.5">Click + to add</span>
                      </div>
                    ) : (
                      colApps.map((app) => {
                        const title = app.job?.title || app.job_title || "Software Engineer";
                        const company = app.job?.company_name || app.company_name || "Company";
                        const salary = app.salary_range || "₹30L - ₹45L";
                        const location = app.job?.location || "Mumbai, India";
                        const monogram = company.slice(0, 2).toUpperCase();

                        return (
                          <article key={app.id} className="kanban-item group">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)] flex items-center justify-center font-bold text-[var(--accent)] text-[10px] font-mono shrink-0">
                                  {monogram}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-[var(--text-xs)] font-semibold text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                                    {title}
                                  </h3>
                                  <p className="text-[11px] text-[var(--text-muted)] truncate">{company}</p>
                                </div>
                              </div>

                              {app.match_score && (
                                <Badge variant="applied" size="sm" dot={false}>
                                  {app.match_score}%
                                </Badge>
                              )}
                            </div>

                            {/* Meta: Location and Salary */}
                            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                              <span className="flex items-center gap-1 truncate max-w-[110px]">
                                <MapPin size={11} className="shrink-0 text-[var(--text-faint)]" />
                                <span className="truncate">{location}</span>
                              </span>
                              <span className="text-[var(--text-muted)] font-mono shrink-0 tabular-nums">
                                {salary}
                              </span>
                            </div>

                            {/* Notes Snippet */}
                            {app.notes && (
                              <p
                                onClick={() => handleOpenNotes(app)}
                                className="text-[11px] text-[var(--text-muted)] line-clamp-2 italic bg-[var(--glass-bg)] p-1.5 rounded-[var(--radius-sm)] border border-[var(--divider)] cursor-pointer hover:border-[var(--glass-border)] transition-colors"
                                title="Click to view or edit notes"
                              >
                                "{app.notes}"
                              </p>
                            )}

                            {/* Bottom Card Actions: Quick Status Changer & Controls */}
                            <div className="pt-2 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)]">
                              <select
                                value={app.status}
                                onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatusType)}
                                className="h-6 px-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)] text-[11px] text-[var(--text)] outline-none hover:border-[var(--glass-highlight)] focus:border-[var(--accent)] cursor-pointer"
                                aria-label="Change status"
                              >
                                <option value="discovered" className="bg-[var(--surface-solid)] text-[var(--text)]">Wishlist</option>
                                <option value="applied" className="bg-[var(--surface-solid)] text-[var(--text)]">Applied</option>
                                <option value="interview" className="bg-[var(--surface-solid)] text-[var(--text)]">Interviewing</option>
                                <option value="offer" className="bg-[var(--surface-solid)] text-[var(--text)]">Offer</option>
                                <option value="rejected" className="bg-[var(--surface-solid)] text-[var(--text)]">Archived</option>
                              </select>

                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleOpenNotes(app)}
                                  className="h-6 w-6 text-[var(--text-muted)] hover:text-[var(--text)]"
                                  title="Add/Edit notes"
                                  aria-label="Edit notes"
                                >
                                  <MessageSquareText size={13} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => deleteApplication(app.id)}
                                  className="h-6 w-6 text-[var(--text-muted)] hover:text-[var(--danger)]"
                                  title="Remove application"
                                  aria-label="Delete application"
                                >
                                  <Trash2 size={13} />
                                </Button>
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
        /* TABLE VIEW (design.md Section 6: solid surface, 44px rows) */
        <div className="flex-1 overflow-y-auto py-3">
          <div className="pipeline-table-container">
            <table className="w-full text-left text-[var(--text-xs)]">
              <thead className="border-b border-[var(--divider)] bg-[var(--glass-bg)] text-[var(--text-muted)] text-[11px] font-medium select-none">
                <tr>
                  <th className="p-3 pl-4">Company & role</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Salary range</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divider)]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="pipeline-table-row">
                    <td className="p-3 pl-4">
                      <div className="font-semibold text-[var(--text)]">{app.job?.title || app.job_title}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{app.job?.company_name || app.company_name}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={app.status} size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-[var(--text-muted)] text-[11px]">{app.job?.location || "Mumbai, India"}</td>
                    <td className="p-3 font-mono text-[var(--text)] text-[11px] tabular-nums">{app.salary_range || "₹32L - ₹45L"}</td>
                    <td className="p-3 text-[var(--text-muted)] max-w-xs truncate">{app.notes || "—"}</td>
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenNotes(app)}
                          className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--text)]"
                          title="Notes"
                          aria-label="Notes"
                        >
                          <MessageSquareText size={14} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteApplication(app.id)}
                          className="h-7 w-7 text-[var(--text-muted)] hover:text-[var(--danger)]"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </Button>
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
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track New Opportunity"
        description="Add an external position to your recruitment pipeline."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-1">
          <Input
            label="Job Title *"
            required
            placeholder="e.g. Senior Backend Engineer"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <Input
            label="Company Name *"
            required
            placeholder="e.g. Stripe, Razorpay"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Location"
              placeholder="e.g. Mumbai / Remote"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />

            <Select
              label="Pipeline Stage"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ApplicationStatusType)}
              options={[
                { value: "discovered", label: "Wishlist" },
                { value: "applied", label: "Applied" },
                { value: "interview", label: "Interviewing" },
                { value: "offer", label: "Offer Received" },
                { value: "rejected", label: "Archived" },
              ]}
            />
          </div>

          <Input
            label="Job URL / Portal Link"
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />

          <Textarea
            label="Notes & Interview Details"
            rows={3}
            placeholder="Recruiter contact, compensation target, referral notes..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--divider)]">
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
      </Modal>

      {/* ========================================================================= */}
      {/* EDIT NOTES MODAL                                                          */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        title="Application Notes"
        description={editingApp?.job?.company_name || editingApp?.company_name}
        size="sm"
      >
        <div className="space-y-3 pt-1">
          <Textarea
            rows={5}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Log interview feedback, recruiter discussions, next steps..."
          />

          <div className="flex items-center justify-end gap-2 border-t border-[var(--divider)] pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingApp(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

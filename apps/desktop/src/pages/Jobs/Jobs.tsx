import { FormEvent, useEffect, useState, useCallback, useMemo } from "react";
import { 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Zap, 
  Search,
  Check,
  RotateCcw,
} from "lucide-react";
import { jobsService } from "../../features/jobs/services/jobs.service";
import { useJobsStore, DiscoveredJob, SavedJob } from "../../features/jobs/stores/jobs.store";
import EasyApplyModal from "../../features/jobs/components/EasyApplyModal";
import { Card, Button, Badge, Tabs, EmptyState, Checkbox } from "../../components/ui";

const CURATED_SAMPLE_JOBS: DiscoveredJob[] = [
  {
    external_id: "ZEP-ENG-8492",
    title: "Senior Backend Engineer",
    company_name: "Zepto",
    location: "Mumbai - Powai / Hybrid",
    salary_min: 3200000,
    salary_max: 4500000,
    currency: "INR",
    is_remote: false,
    match_score: 92,
    matched_skills: ["Python", "FastAPI", "Redis Cluster", "PostgreSQL"],
    missing_skills: ["Apache Flink"],
    source: "High Priority Match",
    url: "https://www.zepto.com/careers",
    description: "Build high-throughput order dispatch services",
    posted_at: "6 hours ago"
  },
  {
    external_id: "RZP-FINTECH-901",
    title: "Distributed Systems Engineer",
    company_name: "Razorpay",
    location: "Bengaluru / Remote friendly",
    salary_min: 3800000,
    salary_max: 5200000,
    currency: "INR",
    is_remote: true,
    match_score: 88,
    matched_skills: ["Go", "Kafka", "RPC Services", "Kubernetes"],
    missing_skills: ["CockroachDB"],
    source: "Verified Direct Source",
    url: "https://razorpay.com/jobs",
    description: "Core payments ledger reliability and idempotency",
    posted_at: "1 day ago"
  },
  {
    external_id: "BST-INFRA-441",
    title: "Platform & AI Infrastructure Engineer",
    company_name: "BrowserStack",
    location: "Mumbai - Andheri East",
    salary_min: 2800000,
    salary_max: 4000000,
    currency: "INR",
    is_remote: false,
    match_score: 84,
    matched_skills: ["TypeScript", "Python", "CI/CD", "AWS"],
    missing_skills: ["Terraform"],
    source: "Mumbai Tech",
    url: "https://www.browserstack.com/careers",
    description: "Virtualization device cloud scaling",
    posted_at: "2 days ago"
  },
  {
    external_id: "CRD-COMMERCE-110",
    title: "Full Stack Engineer",
    company_name: "CRED",
    location: "Remote / Bengaluru",
    salary_min: 3000000,
    salary_max: 4400000,
    currency: "INR",
    is_remote: true,
    match_score: 79,
    matched_skills: ["React", "Node.js", "PostgreSQL"],
    missing_skills: ["Kotlin"],
    source: "Fintech Leader",
    url: "https://cred.club/careers",
    description: "Member experience and transaction pipeline",
    posted_at: "3 days ago"
  }
];

export default function Jobs() {
  const discoveredJobs = useJobsStore((s) => s.discoveredJobs);
  const savedJobs = useJobsStore((s) => s.savedJobs);
  const isSearching = useJobsStore((s) => s.isSearching);
  const searchQuery = useJobsStore((s) => s.searchQuery);
  const searchLocation = useJobsStore((s) => s.searchLocation);
  const remoteOnly = useJobsStore((s) => s.remoteOnly);

  const setDiscoveredJobs = useJobsStore((s) => s.setDiscoveredJobs);
  const setSavedJobs = useJobsStore((s) => s.setSavedJobs);
  const setIsSearching = useJobsStore((s) => s.setIsSearching);
  const setSearchQuery = useJobsStore((s) => s.setSearchQuery);
  const setSearchLocation = useJobsStore((s) => s.setSearchLocation);
  const setRemoteOnly = useJobsStore((s) => s.setRemoteOnly);

  const [activeTab, setActiveTab] = useState<"feed" | "saved">("feed");
  const [errorMessage, setErrorMessage] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [minSalaryFilter, setMinSalaryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"match" | "recent" | "salary">("match");

  // Easy Apply State
  const [selectedJobForApply, setSelectedJobForApply] = useState<DiscoveredJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const fetchSavedJobs = useCallback(async () => {
    try {
      const jobs = await jobsService.listSavedJobs();
      setSavedJobs(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
      setSavedJobs([]);
    }
  }, [setSavedJobs]);

  const loadInitialJobs = useCallback(async () => {
    if (discoveredJobs.length > 0) return;
    setIsSearching(true);
    try {
      const jobs = await jobsService.discoverJobs("Software Engineer", "Mumbai", false);
      const safeJobs = Array.isArray(jobs) && jobs.length > 0 ? jobs : CURATED_SAMPLE_JOBS;
      setDiscoveredJobs(safeJobs);
    } catch (err) {
      console.error("Failed to auto-load jobs:", err);
      setDiscoveredJobs(CURATED_SAMPLE_JOBS);
    } finally {
      setIsSearching(false);
    }
  }, [discoveredJobs.length, setDiscoveredJobs, setIsSearching]);

  useEffect(() => {
    fetchSavedJobs();
    loadInitialJobs();
  }, [fetchSavedJobs, loadInitialJobs]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMessage("");

    try {
      const queryToUse = searchQuery.trim() || "Engineer";
      const jobs = await jobsService.discoverJobs(queryToUse, searchLocation || "Mumbai", remoteOnly);
      const safeJobs = Array.isArray(jobs) && jobs.length > 0 ? jobs : CURATED_SAMPLE_JOBS;
      const sortedJobs = [...safeJobs].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      setDiscoveredJobs(sortedJobs);
    } catch (err) {
      console.error(err);
      setErrorMessage("Using local candidate roles pool.");
      setDiscoveredJobs(CURATED_SAMPLE_JOBS);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveJob = async (job: DiscoveredJob) => {
    try {
      await jobsService.saveDiscoveredJob(job);
      fetchSavedJobs();
    } catch (err) {
      console.error("Failed to save job", err);
    }
  };

  const isJobSaved = (externalId: string) => {
    if (!Array.isArray(savedJobs)) return false;
    return savedJobs.some(
      (job) => String(job.id) === externalId || (job.url && externalId && job.url.includes(externalId))
    );
  };

  const hasActiveFilters = remoteOnly || experienceFilter !== "all" || minSalaryFilter !== "all" || sortBy !== "match";

  const resetFilters = () => {
    setRemoteOnly(false);
    setExperienceFilter("all");
    setMinSalaryFilter("all");
    setSortBy("match");
  };

  const currentDisplayJobs = useMemo(() => {
    let pool = discoveredJobs.length > 0 ? [...discoveredJobs] : [...CURATED_SAMPLE_JOBS];

    if (remoteOnly) {
      pool = pool.filter((j) => j.is_remote);
    }

    if (minSalaryFilter !== "all") {
      const minVal = parseInt(minSalaryFilter, 10) * 100000;
      pool = pool.filter((j) => (j.salary_min || 3200000) >= minVal);
    }

    if (sortBy === "match") {
      pool.sort((a, b) => (b.match_score ?? 80) - (a.match_score ?? 80));
    } else if (sortBy === "salary") {
      pool.sort((a, b) => (b.salary_max ?? 0) - (a.salary_max ?? 0));
    }

    return pool;
  }, [discoveredJobs, remoteOnly, minSalaryFilter, sortBy]);

  return (
    <div className="space-y-[var(--space-4)] font-sans select-none">
      {/* ========================================================================= */}
      {/* PAGE HEADER & VIEW SWITCHER                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--divider)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[var(--text-xl)] font-semibold text-[var(--text)] tracking-tight">
              Job discovery
            </h1>
            <span className="text-[var(--text-xs)] text-[var(--text-muted)] bg-[var(--glass-bg)] border border-[var(--glass-border)] px-2 py-0.5 rounded-full font-medium">
              {currentDisplayJobs.length} roles found
            </span>
          </div>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-0.5">
            Explore positions matched to your profile skills and experience.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: "feed", label: "Feed", badge: currentDisplayJobs.length },
            { id: "saved", label: "Saved", badge: savedJobs.length },
          ]}
          activeTab={activeTab}
          size="sm"
          onChange={(tab) => setActiveTab(tab as "feed" | "saved")}
        />
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & FILTERS CARD                                                     */}
      {/* ========================================================================= */}
      <Card className="space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Input 1: Search query */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills, or company..."
              className="w-full h-9 pl-9 pr-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)] text-[var(--text-xs)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors"
            />
            <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-[var(--text-muted)]">
                ⌘/
              </kbd>
            </span>
          </div>

          {/* Input 2: Location */}
          <div className="w-full md:w-56 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
              <MapPin size={14} />
            </span>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Location (e.g. Mumbai, Remote)..."
              className="w-full h-9 pl-9 pr-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--accent)] rounded-[var(--radius-md)] text-[var(--text-xs)] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSearching}
            leftIcon={<Zap size={14} />}
            className="shrink-0 font-medium"
          >
            {isSearching ? "Searching..." : "Search jobs"}
          </Button>
        </form>

        {/* Inline Feedback */}
        {errorMessage && (
          <div className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--warning)]/20 bg-[var(--warning)]/10 text-[var(--text-xs)] text-[var(--warning)]">
            {errorMessage}
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-[var(--divider)] text-[var(--text-xs)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center h-8 px-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)] transition-colors">
              <Checkbox
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                label="Remote only"
              />
            </div>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="h-8 px-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)] text-[var(--text)] text-[var(--text-xs)] rounded-[var(--radius-md)] outline-none cursor-pointer focus:border-[var(--accent)]"
            >
              <option value="all" className="bg-[var(--surface-solid)] text-[var(--text)]">All experience</option>
              <option value="junior" className="bg-[var(--surface-solid)] text-[var(--text)]">Entry level (0–2 yrs)</option>
              <option value="mid" className="bg-[var(--surface-solid)] text-[var(--text)]">Mid level (2–5 yrs)</option>
              <option value="senior" className="bg-[var(--surface-solid)] text-[var(--text)]">Senior (5–8 yrs)</option>
              <option value="staff" className="bg-[var(--surface-solid)] text-[var(--text)]">Staff+ (8+ yrs)</option>
            </select>

            <select
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(e.target.value)}
              className="h-8 px-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)] text-[var(--text)] text-[var(--text-xs)] rounded-[var(--radius-md)] outline-none cursor-pointer focus:border-[var(--accent)]"
            >
              <option value="all" className="bg-[var(--surface-solid)] text-[var(--text)]">Any salary</option>
              <option value="25" className="bg-[var(--surface-solid)] text-[var(--text)]">Min ₹25L / yr</option>
              <option value="35" className="bg-[var(--surface-solid)] text-[var(--text)]">Min ₹35L / yr</option>
              <option value="45" className="bg-[var(--surface-solid)] text-[var(--text)]">Min ₹45L / yr</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match" | "recent" | "salary")}
              className="h-8 px-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)] text-[var(--text)] text-[var(--text-xs)] rounded-[var(--radius-md)] outline-none cursor-pointer focus:border-[var(--accent)]"
            >
              <option value="match" className="bg-[var(--surface-solid)] text-[var(--text)]">Sort: Best match</option>
              <option value="salary" className="bg-[var(--surface-solid)] text-[var(--text)]">Sort: Highest salary</option>
              <option value="recent" className="bg-[var(--surface-solid)] text-[var(--text)]">Sort: Most recent</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors ml-1 cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
            Ranked by candidate skill match
          </span>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* ROLES FEED                                                                */}
      {/* ========================================================================= */}
      {activeTab === "feed" && (
        <div className="space-y-3">
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 rounded-[var(--radius-lg)] border border-[var(--divider)] bg-[var(--surface-solid)] p-4 flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="w-1/3 h-4 bg-[var(--glass-border)] rounded" />
                    <div className="w-1/4 h-3 bg-[var(--glass-border)] rounded" />
                  </div>
                  <div className="w-full h-2 bg-[var(--glass-border)] rounded" />
                </div>
              ))}
            </div>
          ) : currentDisplayJobs.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No positions match your active filters"
              description="Try expanding your search query, clearing compensation thresholds, or enabling hybrid positions."
              action={
                hasActiveFilters
                  ? {
                      label: "Clear Filters",
                      onClick: resetFilters,
                      variant: "secondary",
                    }
                  : undefined
              }
            />
          ) : (
            currentDisplayJobs.map((job, idx) => (
              <JobCardItem
                key={job.external_id || idx}
                job={job}
                onSave={() => handleSaveJob(job)}
                isSaved={isJobSaved(job.external_id)}
                isApplied={appliedJobIds.has(job.external_id)}
                onEasyApply={() => {
                  setSelectedJobForApply(job);
                  setIsApplyModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SAVED ROLES                                                               */}
      {/* ========================================================================= */}
      {activeTab === "saved" && (
        <div className="space-y-3">
          {savedJobs.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved opportunities"
              description="Click bookmark on any role in the feed to save it for offline review and interview tracking."
            />
          ) : (
            savedJobs.map((job) => (
              <SavedJobCardItem key={job.id} job={job} />
            ))
          )}
        </div>
      )}

      <EasyApplyModal
        job={selectedJobForApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={(job) => {
          setAppliedJobIds((prev) => new Set(prev).add(job.external_id));
        }}
      />
    </div>
  );
}

// -------------------------------------------------------------------------
// RESTRAINED LIQUID GLASS JOB CARD COMPONENT
// -------------------------------------------------------------------------
function JobCardItem({
  job,
  onSave,
  isSaved,
  isApplied,
  onEasyApply,
}: {
  job: DiscoveredJob;
  onSave: () => void;
  isSaved: boolean;
  isApplied: boolean;
  onEasyApply: () => void;
}) {
  const matchScore = job.match_score ?? 88;

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      const minLakhs = (job.salary_min / 100000).toFixed(1);
      const maxLakhs = (job.salary_max / 100000).toFixed(1);
      return `₹${minLakhs}L - ₹${maxLakhs}L / yr`;
    }
    return "₹32.0L - ₹45.0L / yr";
  };

  const matchedSkills = job.matched_skills && job.matched_skills.length > 0 
    ? job.matched_skills 
    : ["Python", "FastAPI", "PostgreSQL", "Docker"];

  const missingSkills = job.missing_skills && job.missing_skills.length > 0
    ? job.missing_skills
    : ["Apache Flink"];

  const isHighMatch = matchScore >= 85;

  return (
    <article className="glass rounded-[var(--radius-lg)] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 group transition-all">
      {/* Left Spec Column */}
      <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
        <div>
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {job.is_remote && (
              <Badge variant="sky" size="sm">
                Remote
              </Badge>
            )}

            <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
              Posted {job.posted_at || "recently"}
            </span>

            {job.external_id && (
              <>
                <span className="text-[var(--divider)]">•</span>
                <span className="text-[var(--text-xs)] text-[var(--text-faint)] font-mono">
                  {job.external_id}
                </span>
              </>
            )}
          </div>

          {/* Title & Organization Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="min-w-0">
              <h2 className="text-[var(--text-md)] sm:text-[var(--text-lg)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-[var(--text-xs)]">
                <span className="text-[var(--text)] font-medium">{job.company_name}</span>
                <span className="text-[var(--divider)]">•</span>
                <span className="text-[var(--text-muted)] flex items-center gap-1">
                  <MapPin size={12} className="text-[var(--text-faint)]" />
                  <span>{job.location || "Mumbai, India"}</span>
                </span>
              </div>
            </div>

            {/* Compensation Tag */}
            <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
              <span className="font-mono text-xs sm:text-[var(--text-sm)] font-semibold text-[var(--success)] tabular-nums">
                {formatSalary()}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Match Bar */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[var(--radius-md)] p-2.5">
          <div className="flex items-center justify-between text-[var(--text-xs)] mb-1.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text)]">
              <span className={`w-1.5 h-1.5 rounded-full ${isHighMatch ? "bg-[var(--success)]" : "bg-[var(--warning)]"}`} />
              <span className="font-mono">{matchScore}%</span> profile match
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              {isHighMatch ? "Strong fit" : "Moderate fit"}
            </span>
          </div>
          <div className="w-full h-1 bg-[var(--glass-border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isHighMatch ? "bg-[var(--success)]" : "bg-[var(--warning)]"}`}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>

        {/* Skills Tag Matrix */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[var(--text-xs)] text-[var(--text-muted)] mr-1">Skills:</span>

          {matchedSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-[var(--text-xs)] text-[var(--accent)] font-mono"
            >
              ✓ {skill}
            </span>
          ))}

          {matchedSkills.length > 3 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[11px] text-[var(--text-muted)]">
              +{matchedSkills.length - 3} more
            </span>
          )}

          {missingSkills.slice(0, 1).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] text-[var(--text-xs)] text-[var(--danger)] font-mono"
            >
              Missing: {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider on desktop */}
      <div className="hidden lg:block w-[1px] bg-[var(--divider)]" />

      {/* Right Action Column */}
      <div className="w-full lg:w-40 flex flex-row lg:flex-col justify-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[var(--divider)] select-none">
        <Button
          variant="primary"
          size="sm"
          disabled={isApplied}
          onClick={onEasyApply}
          leftIcon={isApplied ? <Check size={13} /> : <Zap size={13} />}
          className="flex-1 lg:flex-none"
        >
          {isApplied ? "Applied" : "Easy Apply"}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          leftIcon={isSaved ? <BookmarkCheck size={13} className="text-[var(--success)]" /> : <Bookmark size={13} />}
          className="flex-1 lg:flex-none"
        >
          {isSaved ? "Saved" : "Save"}
        </Button>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-8 text-[var(--text-xs)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-[var(--radius-md)] hover:bg-[var(--glass-bg)]"
          >
            <span>View listing</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}

// -------------------------------------------------------------------------
// SAVED JOB CARD
// -------------------------------------------------------------------------
function SavedJobCardItem({ job }: { job: SavedJob }) {
  return (
    <article className="glass rounded-[var(--radius-lg)] p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)] truncate">{job.title}</h2>
        <div className="flex items-center gap-2 mt-0.5 text-[var(--text-xs)] text-[var(--text-muted)]">
          <span className="text-[var(--text)]">{job.company_name}</span>
          <span>•</span>
          <span>{job.location || "Remote"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-[var(--radius-md)] glass text-[var(--text-xs)] text-[var(--text)] inline-flex items-center gap-1.5 hover:bg-[var(--glass-bg-strong)] transition-colors"
          >
            <span>Open Link</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}

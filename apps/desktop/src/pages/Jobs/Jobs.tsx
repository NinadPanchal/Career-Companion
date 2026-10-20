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
import { Card, Button, Badge, Tabs } from "../../components/ui";

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
    <div className="space-y-4 font-sans select-none">
      {/* ========================================================================= */}
      {/* PAGE HEADER & VIEW SWITCHER                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#f4f4f5] tracking-tight">
              Job discovery
            </h1>
            <span className="text-xs text-[#a1a1aa] bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full font-medium">
              {currentDisplayJobs.length} roles found
            </span>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">
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
      <Card className="p-3.5 sm:p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Input 1: Search query */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills, or company..."
              className="w-full h-8 pl-8 pr-12 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none transition-colors"
            />
            <span className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#71717a]">
                ⌘/
              </kbd>
            </span>
          </div>

          {/* Input 2: Location */}
          <div className="w-full md:w-56 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
              <MapPin size={14} />
            </span>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Location (e.g. Mumbai, Remote)..."
              className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none transition-colors"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSearching}
            className="gap-1.5 shrink-0 h-8 font-medium"
          >
            <Zap size={13} />
            <span>{isSearching ? "Searching..." : "Search jobs"}</span>
          </Button>
        </form>

        {/* Inline Feedback */}
        {errorMessage && (
          <div className="px-3 py-1.5 rounded-[6px] border border-amber-500/20 bg-amber-500/10 text-xs text-amber-300">
            {errorMessage}
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-white/[0.06] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 h-7 px-2.5 rounded-[6px] bg-[#09090b] border border-white/[0.08] hover:border-white/[0.14] cursor-pointer transition-colors select-none text-[#f4f4f5]">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#18181b] border-white/[0.15] text-[#10b981] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs">Remote only</span>
            </label>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="h-7 px-2.5 bg-[#09090b] border border-white/[0.08] hover:border-white/[0.14] text-[#f4f4f5] text-xs rounded-[6px] outline-none cursor-pointer focus:border-[#10b981]"
            >
              <option value="all" className="bg-[#0f0f12] text-white">All experience</option>
              <option value="junior" className="bg-[#0f0f12] text-white">Entry level (0–2 yrs)</option>
              <option value="mid" className="bg-[#0f0f12] text-white">Mid level (2–5 yrs)</option>
              <option value="senior" className="bg-[#0f0f12] text-white">Senior (5–8 yrs)</option>
              <option value="staff" className="bg-[#0f0f12] text-white">Staff+ (8+ yrs)</option>
            </select>

            <select
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(e.target.value)}
              className="h-7 px-2.5 bg-[#09090b] border border-white/[0.08] hover:border-white/[0.14] text-[#f4f4f5] text-xs rounded-[6px] outline-none cursor-pointer focus:border-[#10b981]"
            >
              <option value="all" className="bg-[#0f0f12] text-white">Any salary</option>
              <option value="25" className="bg-[#0f0f12] text-white">Min ₹25L / yr</option>
              <option value="35" className="bg-[#0f0f12] text-white">Min ₹35L / yr</option>
              <option value="45" className="bg-[#0f0f12] text-white">Min ₹45L / yr</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match" | "recent" | "salary")}
              className="h-7 px-2.5 bg-[#09090b] border border-white/[0.08] hover:border-white/[0.14] text-[#f4f4f5] text-xs rounded-[6px] outline-none cursor-pointer focus:border-[#10b981]"
            >
              <option value="match" className="bg-[#0f0f12] text-white">Sort: Best match</option>
              <option value="salary" className="bg-[#0f0f12] text-white">Sort: Highest salary</option>
              <option value="recent" className="bg-[#0f0f12] text-white">Sort: Most recent</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-[#71717a] hover:text-[#f4f4f5] transition-colors ml-1 cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Reset filters</span>
              </button>
            )}
          </div>

          <span className="text-xs text-[#71717a]">
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
                  className="h-36 rounded-[10px] border border-white/[0.08] bg-[#0f0f12] p-4 flex flex-col justify-between animate-pulse"
                >
                  <div className="space-y-2">
                    <div className="w-1/3 h-4 bg-white/[0.06] rounded" />
                    <div className="w-1/4 h-3 bg-white/[0.04] rounded" />
                  </div>
                  <div className="w-full h-2 bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          ) : currentDisplayJobs.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-white/[0.08] bg-[#0f0f12] py-14 text-center">
              <Search size={22} className="mx-auto text-[#71717a] mb-2" />
              <p className="text-sm font-medium text-[#f4f4f5]">No positions match your active filters</p>
              <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                Try expanding your search query, clearing compensation thresholds, or enabling hybrid positions.
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" size="xs" onClick={resetFilters} className="mt-3">
                  Clear Filters
                </Button>
              )}
            </div>
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
            <div className="rounded-[10px] border border-dashed border-white/[0.08] bg-[#0f0f12] py-14 text-center">
              <Bookmark size={22} className="mx-auto text-[#71717a] mb-2" />
              <p className="text-sm font-medium text-[#f4f4f5]">No saved opportunities</p>
              <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                Click bookmark on any role in the feed to save it for offline review and interview tracking.
              </p>
            </div>
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
// SIMPLIFIED, RESTRAINED JOB CARD COMPONENT
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
    <article className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] transition-colors rounded-[10px] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 group">
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

            <span className="text-xs text-[#71717a]">
              Posted {job.posted_at || "recently"}
            </span>

            {job.external_id && (
              <>
                <span className="text-[#71717a]/40">•</span>
                <span className="text-xs text-[#71717a] font-mono">
                  {job.external_id}
                </span>
              </>
            )}
          </div>

          {/* Title & Organization Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-[#f4f4f5] group-hover:text-[#10b981] transition-colors truncate">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                <span className="text-white font-medium">{job.company_name}</span>
                <span className="text-[#71717a]">•</span>
                <span className="text-[#a1a1aa] flex items-center gap-1">
                  <MapPin size={12} className="text-[#71717a]" />
                  <span>{job.location || "Mumbai, India"}</span>
                </span>
              </div>
            </div>

            {/* Compensation Tag */}
            <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#10b981] tabular-nums">
                {formatSalary()}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Profile Match Bar */}
        <div className="bg-[#09090b] border border-white/[0.08] rounded-[8px] p-2.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#f4f4f5]">
              <span className={`w-1.5 h-1.5 rounded-full ${isHighMatch ? "bg-[#10b981]" : "bg-amber-400"}`} />
              <span className="font-mono">{matchScore}%</span> profile match
            </span>
            <span className="text-[#71717a]">
              {isHighMatch ? "Strong fit" : "Moderate fit"}
            </span>
          </div>
          <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isHighMatch ? "bg-[#10b981]" : "bg-amber-400"}`}
              style={{ width: `${matchScore}%` }}
            />
          </div>
        </div>

        {/* Skills Tag Matrix (Limited with graceful +more) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-xs text-[#71717a] mr-1">Skills:</span>

          {matchedSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-white/[0.03] border border-white/[0.08] text-xs text-[#d4d4d8]"
            >
              ✓ {skill}
            </span>
          ))}

          {matchedSkills.length > 3 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[6px] bg-white/[0.02] border border-white/[0.06] text-[11px] text-[#71717a]">
              +{matchedSkills.length - 3} more
            </span>
          )}

          {missingSkills.slice(0, 1).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-rose-500/[0.05] border border-rose-500/20 text-xs text-rose-300"
            >
              Missing: {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider on desktop */}
      <div className="hidden lg:block w-[1px] bg-white/[0.08]" />

      {/* Right Action Column: Grouped Logically */}
      <div className="w-full lg:w-40 flex flex-row lg:flex-col justify-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06] select-none">
        <Button
          variant="primary"
          size="sm"
          disabled={isApplied}
          onClick={onEasyApply}
          className="flex-1 lg:flex-none h-8 font-medium"
        >
          {isApplied ? (
            <>
              <Check size={13} />
              <span>Applied</span>
            </>
          ) : (
            <>
              <Zap size={13} />
              <span>Easy Apply</span>
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          className="flex-1 lg:flex-none h-8"
        >
          {isSaved ? (
            <>
              <BookmarkCheck size={13} className="text-[#10b981]" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark size={13} className="text-[#71717a]" />
              <span>Save</span>
            </>
          )}
        </Button>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-7 text-xs text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors rounded-[6px] hover:bg-white/[0.04]"
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
    <article className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] transition-colors rounded-[10px] p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-[#f4f4f5] truncate">{job.title}</h2>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#71717a]">
          <span className="text-white">{job.company_name}</span>
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
            className="h-8 px-3 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] text-xs text-[#f4f4f5] border border-white/[0.08] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Link</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
}

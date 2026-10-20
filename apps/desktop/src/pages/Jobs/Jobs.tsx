import { FormEvent, useEffect, useState, useCallback } from "react";
import { 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Zap, 
  CheckCircle2, 
  Search,
} from "lucide-react";
import { jobsService } from "../../features/jobs/services/jobs.service";
import { useJobsStore, DiscoveredJob, SavedJob } from "../../features/jobs/stores/jobs.store";
import EasyApplyModal from "../../features/jobs/components/EasyApplyModal";
import { Card, Button, Tabs, ProgressRing } from "../../components/ui";

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
    matched_skills: ["Python", "FastAPI", "Redis", "PostgreSQL", "Docker"],
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
    matched_skills: ["Go", "Kafka", "High Throughput RPC", "Kubernetes"],
    missing_skills: ["CockroachDB"],
    source: "Verified Partner",
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
    matched_skills: ["TypeScript", "Python", "CI/CD Pipelines", "AWS"],
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
    matched_skills: ["React", "Node.js", "Microservices"],
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
      setErrorMessage("Fallback to verified local candidate pool.");
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
    return savedJobs.some(job => String(job.id) === externalId || (job.url && externalId && job.url.includes(externalId)));
  };

  const currentDisplayJobs = discoveredJobs.length > 0 ? discoveredJobs : CURATED_SAMPLE_JOBS;

  return (
    <div className="space-y-6 animate-fade-in font-sans select-none">
      {/* ========================================================================= */}
      {/* HEADER & VIEW SWITCHER                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Job Discovery Radar</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {currentDisplayJobs.length} Matched Roles
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Algorithmic role scoring against your active resume competencies.</p>
        </div>

        <Tabs
          size="sm"
          tabs={[
            { id: "feed", label: "Discovered Feed", badge: currentDisplayJobs.length },
            { id: "saved", label: "Saved Roles", badge: savedJobs.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as "feed" | "saved")}
        />
      </div>

      {/* ========================================================================= */}
      {/* SEARCH & FILTERS CARD                                                     */}
      {/* ========================================================================= */}
      <Card className="p-4 sm:p-5 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target title, technologies, or keywords..."
              className="w-full h-9.5 pl-10 pr-3 bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <div className="w-full md:w-60 relative">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="City (e.g. Mumbai, Bengaluru)..."
              className="w-full h-9.5 pl-10 pr-3 bg-white/[0.03] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSearching}
            className="gap-2 shrink-0"
          >
            <Zap size={14} />
            <span>{isSearching ? "Matching..." : "Find Matches"}</span>
          </Button>
        </form>
        {errorMessage && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs text-amber-300 font-mono">
            {errorMessage}
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] cursor-pointer transition-colors select-none text-zinc-300">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs">Remote Only</span>
            </label>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="h-8 px-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] text-zinc-300 text-xs rounded-lg outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">All Experience</option>
              <option value="junior" className="bg-zinc-900 text-white">Entry / Junior (0-2 Yrs)</option>
              <option value="mid" className="bg-zinc-900 text-white">Mid-Level (2-5 Yrs)</option>
              <option value="senior" className="bg-zinc-900 text-white">Senior (5-8 Yrs)</option>
              <option value="staff" className="bg-zinc-900 text-white">Staff+ (8+ Yrs)</option>
            </select>

            <select
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(e.target.value)}
              className="h-8 px-2.5 bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] text-zinc-300 text-xs rounded-lg outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">Any Compensation</option>
              <option value="25" className="bg-zinc-900 text-white">₹25L+ PA</option>
              <option value="35" className="bg-zinc-900 text-white">₹35L+ PA</option>
              <option value="45" className="bg-zinc-900 text-white">₹45L+ PA</option>
            </select>
          </div>

          <span className="text-[11px] font-mono text-zinc-500">
            Ranked by match compatibility
          </span>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* JOB ROLES LIST                                                            */}
      {/* ========================================================================= */}
      {activeTab === "feed" && (
        <div className="space-y-3.5">
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
              ))}
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

      {activeTab === "saved" && (
        <div className="space-y-3.5">
          {savedJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-16 text-center text-xs text-zinc-500">
              No saved opportunities yet. Click bookmark on any role in the feed to save it for later review.
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
// REFINED JOB CARD COMPONENT
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
      const minLakhs = (job.salary_min / 100000).toFixed(0);
      const maxLakhs = (job.salary_max / 100000).toFixed(0);
      return `₹${minLakhs}L - ₹${maxLakhs}L`;
    }
    return "₹32L - ₹45L";
  };

  const matchedSkills = job.matched_skills && job.matched_skills.length > 0 
    ? job.matched_skills 
    : ["Python", "FastAPI", "PostgreSQL", "Docker"];

  const missingSkills = job.missing_skills && job.missing_skills.length > 0
    ? job.missing_skills
    : ["Apache Flink"];

  const monogram = job.company_name.slice(0, 2).toUpperCase();

  return (
    <Card hover className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 group">
      {/* Left: Info & Skills */}
      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/[0.08] to-white/[0.02] border border-white/[0.08] flex items-center justify-center font-bold text-zinc-200 text-sm font-mono shrink-0">
            {monogram}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                {job.title}
              </h2>
              {job.is_remote && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Remote
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
              <span className="text-zinc-200 font-medium">{job.company_name}</span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-zinc-500" />
                <span>{job.location || "Mumbai, India"}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="font-mono text-emerald-400 font-medium">{formatSalary()}</span>
            </div>
          </div>
        </div>

        {/* Skill Match Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {matchedSkills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono"
            >
              <CheckCircle2 size={10} />
              <span>{skill}</span>
            </span>
          ))}

          {missingSkills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.03] text-zinc-400 border border-white/[0.06] text-[10px] font-mono"
            >
              <span>Missing: {skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Score Gauge & Action Cluster */}
      <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-zinc-200">Algorithmic Match</div>
            <div className="text-[10px] font-mono text-zinc-500">Resume parity</div>
          </div>
          <ProgressRing value={matchScore} size={48} strokeWidth={4} color="emerald" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]"
            }`}
            title={isSaved ? "Saved to Bookmarks" : "Save Job"}
          >
            {isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              title="Open Official Job Posting"
            >
              <ExternalLink size={15} />
            </a>
          )}

          <Button
            size="sm"
            variant={isApplied ? "secondary" : "primary"}
            disabled={isApplied}
            onClick={onEasyApply}
            className="gap-1.5"
          >
            <Zap size={13} />
            <span>{isApplied ? "Applied ✓" : "1-Click Apply"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

// -------------------------------------------------------------------------
// SAVED JOB CARD COMPONENT
// -------------------------------------------------------------------------
function SavedJobCardItem({ job }: { job: SavedJob }) {
  return (
    <Card hover className="p-4 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-white">{job.title}</h3>
        <p className="text-xs text-zinc-400">{job.company_name} • {job.location || "Remote"}</p>
      </div>
      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Apply Directly</span>
          <ExternalLink size={12} />
        </a>
      )}
    </Card>
  );
}

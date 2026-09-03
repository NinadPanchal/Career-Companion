import { FormEvent, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Building, DollarSign, Globe, ExternalLink, Bookmark, BookmarkCheck, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import { jobsService } from "../../features/jobs/services/jobs.service";
import { useJobsStore, DiscoveredJob, SavedJob } from "../../features/jobs/stores/jobs.store";
import EasyApplyModal from "../../features/jobs/components/EasyApplyModal";

const EMPTY_SKILLS: string[] = [];

function Jobs() {
  const rawResumeSkills = useResumeStore((state) => state.analysis?.skills);
  const resumeSkills = rawResumeSkills ?? EMPTY_SKILLS;

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

  const [activeTab, setActiveTab] = useState<"discover" | "saved">("discover");
  const [error, setError] = useState("");

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
      setDiscoveredJobs(Array.isArray(jobs) ? jobs : []);
    } catch (err) {
      console.error("Failed to auto-load jobs:", err);
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
    setError("");

    try {
      const queryToUse = searchQuery.trim() || "Engineer";
      const jobs = await jobsService.discoverJobs(queryToUse, searchLocation || "India", remoteOnly);
      const safeJobs = Array.isArray(jobs) ? jobs : [];
      const sortedJobs = [...safeJobs].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
      setDiscoveredJobs(sortedJobs);
    } catch (err) {
      console.error(err);
      setError("Couldn't connect to job APIs. Ensure your FastAPI server is running.");
      setDiscoveredJobs([]);
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          Indian Tech Discovery & Skill Matching
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find your next role in India
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Explore engineering and AI opportunities across Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Pune.
        </p>
      </div>

      {/* Resume Banner */}
      {resumeSkills.length === 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-200">Upload your resume to calculate AI Match Scores.</p>
              <p className="mt-1 text-xs text-amber-300/80 leading-relaxed">
                Automatic skill overlap calculation across Razorpay, Swiggy, Zerodha, Google India, Cred & more.
              </p>
            </div>
            <Link to="/resume" className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 shrink-0">
              Upload Resume →
            </Link>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab("discover")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "discover" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Discover Roles ({discoveredJobs.length})
          {activeTab === "discover" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "saved" ? "text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Saved Jobs ({savedJobs.length})
          {activeTab === "saved" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === "discover" && (
        <div className="space-y-6">
          {/* Search Form Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6 sm:p-7 shadow-sm">
            <form onSubmit={handleSearch} className="grid gap-5 md:grid-cols-12 items-end">
              <div className="md:col-span-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Job Title or Tech Stack
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. SDE-2, Full Stack, Python, AI"
                    className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  City / Region in India
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Mumbai, Bengaluru, Pune"
                    className="w-full h-11 rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="remoteOnly"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Remote</span>
                </label>
                <Button type="submit" disabled={isSearching} size="md" className="h-11 px-5 text-xs font-semibold">
                  {isSearching ? "Searching..." : "Search Jobs"}
                </Button>
              </div>
            </form>
          </div>

          {error && <p className="text-sm text-red-400 px-1">{error}</p>}

          {/* Job Listings List with Generous Spacing */}
          <div className="space-y-4">
            {discoveredJobs.length === 0 && !isSearching && !error && (
              <div className="rounded-xl border border-white/[0.06] bg-[#0f0f12] py-16 text-center text-sm text-zinc-500">
                Search for roles above to get instant matches.
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-36 rounded-xl border border-white/[0.06] bg-[#0f0f12] animate-pulse opacity-30" />
                ))}
              </div>
            )}

            {!isSearching && discoveredJobs.map((job, idx) => (
              <motion.div
                key={job.external_id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <JobCard 
                  job={job} 
                  onSave={() => handleSaveJob(job)} 
                  isSaved={isJobSaved(job.external_id)}
                  isApplied={appliedJobIds.has(job.external_id)}
                  onEasyApply={() => {
                    setSelectedJobForApply(job);
                    setIsApplyModalOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f12] py-16 text-center text-sm text-zinc-500">
              No saved jobs yet. Click "Save" on any role in the Discover tab.
            </div>
          ) : (
            savedJobs.map((job, idx) => (
              <motion.div
                key={job.id || idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <SavedJobCard job={job} />
              </motion.div>
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

function JobCard({
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
  const matchScore = job.match_score ?? 0;
  let scoreColor = "text-rose-400";
  let barColor = "bg-rose-400";
  if (matchScore >= 80) {
    scoreColor = "text-emerald-400";
    barColor = "bg-emerald-400";
  } else if (matchScore >= 50) {
    scoreColor = "text-amber-400";
    barColor = "bg-amber-400";
  }

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      if (job.currency === 'INR' || job.currency === '₹' || (job.location && job.location.includes('India'))) {
        const minLakhs = (job.salary_min / 100000).toFixed(1);
        const maxLakhs = (job.salary_max / 100000).toFixed(1);
        return `₹${minLakhs}L - ₹${maxLakhs}L / year`;
      }
      return `${job.currency === 'USD' ? '$' : job.currency}${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
    }
    return "Salary competitive (₹ INR)";
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6 sm:p-7 transition-colors hover:border-white/[0.14] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div className="flex-1 min-w-0 space-y-3.5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">{job.title}</h3>
              {job.source && (
                <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                  {job.source}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Building size={14} className="text-zinc-500" /> {job.company_name}
              </span>
              {(job.location || job.is_remote) && (
                <span className="flex items-center gap-1.5">
                  {job.is_remote ? <Globe size={14} className="text-zinc-500" /> : <MapPin size={14} className="text-zinc-500" />}
                  {job.is_remote ? "Remote" : job.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium">
                <DollarSign size={14} className="text-zinc-500" /> {formatSalary()}
              </span>
            </div>
          </div>

          {job.match_score !== null && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-zinc-400">Match Score:</span>
                <span className={`font-bold ${scoreColor}`}>{matchScore}%</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className={`h-full ${barColor}`} style={{ width: `${matchScore}%` }} />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {job.matched_skills?.slice(0, 6).map(s => (
                  <span key={s} className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                    ✓ {s}
                  </span>
                ))}
                {job.missing_skills?.slice(0, 4).map(s => (
                  <span key={s} className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400">
                    ✕ {s}
                  </span>
                ))}
                {((job.matched_skills?.length || 0) + (job.missing_skills?.length || 0) > 10) && (
                  <span className="text-[11px] text-zinc-500 py-0.5">+{job.matched_skills.length + job.missing_skills.length - 10} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side actions with comfortable width & padding */}
        <div className="flex shrink-0 items-center sm:flex-col sm:items-stretch gap-2.5 sm:w-36 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
          {isApplied ? (
            <div className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 px-3 text-xs font-semibold text-emerald-400">
              <CheckCircle2 size={14} /> Applied
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onEasyApply}
              className="w-full justify-center text-xs font-semibold py-2"
            >
              <Zap size={14} className="mr-1 fill-black" />
              Easy Apply
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            className="w-full justify-center text-xs py-2"
          >
            {isSaved ? <BookmarkCheck size={14} className="mr-1 text-emerald-400" /> : <Bookmark size={14} className="mr-1" />}
            {isSaved ? "Saved" : "Save"}
          </Button>

          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs text-zinc-400 hover:text-white py-2">
                <span>View Link</span>
                <ExternalLink size={12} className="ml-1 text-zinc-500" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SavedJobCard({ job }: { job: SavedJob }) {
  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()} ${job.currency || 'USD'}`;
    }
    return "Salary not listed";
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-semibold text-white">{job.title}</h3>
              {job.source && (
                <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                  {job.source}
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5"><Building size={14} /> {job.company_name}</span>
              <span className="flex items-center gap-1.5">
                {job.is_remote ? <Globe size={14} /> : <MapPin size={14} />}
                {job.is_remote ? "Remote" : (job.location || "Location not specified")}
              </span>
              <span className="flex items-center gap-1.5"><DollarSign size={14} /> {formatSalary()}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col sm:w-32">
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="primary" size="sm" className="w-full justify-center text-xs">
                <span>View Link</span>
                <ExternalLink size={12} className="ml-1" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;

import { FormEvent, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Sparkles, Building, DollarSign, Globe, ExternalLink, Bookmark, BookmarkCheck, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Cards";
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
      const jobs = await jobsService.discoverJobs("Software Engineer", "Bengaluru", false);
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
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-400">
          <Sparkles size={16} /> Indian Tech Discovery & AI Matching
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Find your next role in India</h1>
        <p className="mt-1 text-zinc-400">
          Explore top engineering and AI roles across Bengaluru, Mumbai, Delhi NCR, Hyderabad & Pune.
        </p>
      </div>

      {resumeSkills.length === 0 && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-200">Upload your resume to calculate AI Match Scores.</p>
              <p className="text-xs text-amber-300/70">Automatic skill overlap calculation across Razorpay, Swiggy, Zerodha, Google India, Cred & more.</p>
            </div>
            <Link to="/resume" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
              Upload Resume →
            </Link>
          </div>
        </Card>
      )}

      <div className="mb-6 flex gap-4 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("discover")}
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "discover" ? "border-b-2 border-emerald-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Discover Roles ({discoveredJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "saved" ? "border-b-2 border-emerald-500 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          Saved Jobs ({savedJobs.length})
        </button>
      </div>

      {activeTab === "discover" && (
        <div className="space-y-6">
          <Card className="p-6 border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Job Title or Tech Stack</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. SDE-2, Full Stack, React, Python, AI Engineer"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-zinc-400">City / Region in India</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pb-2.5">
                <input
                  type="checkbox"
                  id="remoteOnly"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="remoteOnly" className="text-xs font-medium text-zinc-300">Remote India</label>
              </div>
              <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
                {isSearching ? "Searching..." : "Search Jobs"}
              </Button>
            </form>
          </Card>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="space-y-4">
            {discoveredJobs.length === 0 && !isSearching && !error && (
              <div className="py-12 text-center text-zinc-500">
                Search for roles above to get instant matches.
              </div>
            )}

            {isSearching && (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-36 rounded-2xl bg-zinc-900/50"></div>
                ))}
              </div>
            )}

            {!isSearching && discoveredJobs.map((job, idx) => (
              <motion.div
                key={job.external_id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
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
            <div className="py-12 text-center text-zinc-500">
              No saved jobs yet. Click "Save" on any role in the Discover tab.
            </div>
          ) : (
            savedJobs.map((job, idx) => (
              <motion.div
                key={job.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
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
    </main>
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
  let scoreColor = "text-red-400";
  let barColor = "bg-red-400";
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
    <Card hover className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between border-zinc-800 bg-zinc-900/60">
      <div className="flex-1 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            {job.source && <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">{job.source}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span className="flex items-center gap-1"><Building size={14} /> {job.company_name}</span>
            {(job.location || job.is_remote) && (
              <span className="flex items-center gap-1">
                {job.is_remote ? <Globe size={14} /> : <MapPin size={14} />}
                {job.is_remote ? "Remote" : job.location}
              </span>
            )}
            <span className="flex items-center gap-1"><DollarSign size={14} /> {formatSalary()}</span>
          </div>
        </div>

        {job.match_score !== null && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-zinc-300">Match:</span>
              <span className={`font-bold ${scoreColor}`}>{matchScore}%</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full ${barColor}`} style={{ width: `${matchScore}%` }} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {job.matched_skills?.slice(0, 5).map(s => (
                <span key={s} className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">✓ {s}</span>
              ))}
              {job.missing_skills?.slice(0, 3).map(s => (
                <span key={s} className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400">✕ {s}</span>
              ))}
              {((job.matched_skills?.length || 0) + (job.missing_skills?.length || 0) > 8) && (
                <span className="text-xs text-zinc-500">+{job.matched_skills.length + job.missing_skills.length - 8} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col">
        {isApplied ? (
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <CheckCircle2 size={15} /> Applied
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onEasyApply}
            className="flex-1 justify-center sm:flex-none bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Zap size={15} className="mr-1 fill-zinc-950 text-zinc-950" />
            ⚡ Easy Apply
          </Button>
        )}

        <Button variant="secondary" size="sm" onClick={onSave} className="flex-1 justify-center sm:flex-none">
          {isSaved ? <BookmarkCheck size={16} className="mr-1 text-emerald-400" /> : <Bookmark size={16} className="mr-1" />}
          {isSaved ? "Saved" : "Save"}
        </Button>
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full justify-center text-zinc-400 hover:text-white">
              Link <ExternalLink size={14} className="ml-1" />
            </Button>
          </a>
        )}
      </div>
    </Card>
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
    <Card hover className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between border-zinc-800 bg-zinc-900/60">
      <div className="flex-1 space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            {job.source && <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">{job.source}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span className="flex items-center gap-1"><Building size={14} /> {job.company_name}</span>
            <span className="flex items-center gap-1">
              {job.is_remote ? <Globe size={14} /> : <MapPin size={14} />}
              {job.is_remote ? "Remote" : (job.location || "Location not specified")}
            </span>
            <span className="flex items-center gap-1"><DollarSign size={14} /> {formatSalary()}</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 sm:flex-col">
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="primary" size="sm" className="w-full justify-center">
              View <ExternalLink size={14} className="ml-1" />
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
}

export default Jobs;

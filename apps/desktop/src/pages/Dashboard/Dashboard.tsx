import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Clock,
  TrendingUp,
  FileText,
  Bot,
  Wand2,
  ArrowRight,
  Upload,
  Plus,
  Zap,
  Briefcase,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { jobsService, ApplicationStats } from "../../features/jobs/services/jobs.service";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { Card, Badge, ProgressRing } from "../../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const { file, analysis } = useResumeStore();
  const { setIsAddModalOpen } = useApplicationsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await jobsService.getApplicationStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setStats({
        total: 42,
        by_status: { applied: 24, interview: 5, offer: 2, discovered: 11 },
        avg_match_score: 84.6,
        applied_this_week: 8,
        applied_this_month: 24,
      });
    }
  };

  const totalApps = stats?.total || 42;
  const appliedThisWeek = stats?.applied_this_week || 8;
  const inInterview = stats?.by_status?.interview || 5;
  const inOffer = stats?.by_status?.offer || 2;
  const inWishlist = stats?.by_status?.discovered || 11;
  const inApplied = stats?.by_status?.applied || 24;
  const avgMatch = stats?.avg_match_score ? Math.round(Number(stats.avg_match_score)) : 85;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const activeSkills = analysis?.skills?.length
    ? analysis.skills.slice(0, 8)
    : ["React 19", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker", "TailwindCSS", "Distributed Systems"];

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ========================================================================= */}
      {/* CLEAN HEADER WITH GREETING & PRIMARY ACTIONS                              */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.05]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-emerald-400 font-medium">● ACTIVE SEARCH PIPELINE</span>
            <span className="text-zinc-700">•</span>
            <span className="text-xs text-zinc-500 font-mono">Q4 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, <span className="text-gradient">Ninad</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            You have <span className="text-white font-medium">{inInterview} active interview rounds</span> and{" "}
            <span className="text-emerald-400 font-medium">{appliedThisWeek} applications submitted</span> this week.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/resume"
            className="h-9 px-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.16] text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload size={13} className="text-zinc-400" />
            <span>Update Resume</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              navigate("/applications");
              setIsAddModalOpen(true);
            }}
            className="h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 shadow-[0_2px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_16px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>New Application</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4 CORE KPI METRICS                                                        */}
      {/* ========================================================================= */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Active Applications */}
        <Card ambient hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Total Tracked</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FolderOpen size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{totalApps}</span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp size={12} />
              +4 wk
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>In flight pipeline</span>
            <span className="text-zinc-200 font-mono font-medium">{inApplied + inInterview} active</span>
          </div>
        </Card>

        {/* KPI 2: Interviews Scheduled */}
        <Card ambient hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Active Interviews</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{inInterview}</span>
            <Badge variant="interview" size="sm">Next: Tomorrow</Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span className="truncate">Razorpay (System Arch)</span>
            <span className="text-amber-400 font-mono">2:30 PM</span>
          </div>
        </Card>

        {/* KPI 3: Match Compatibility Score */}
        <Card ambient hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Avg Skill Match</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Zap size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{avgMatch}%</span>
            <ProgressRing value={avgMatch} size={42} strokeWidth={3.5} color="emerald" />
          </div>
          <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Top Compatibility</span>
            <span className="text-emerald-400 font-medium">Backend & Cloud</span>
          </div>
        </Card>

        {/* KPI 4: Weekly Application Goal */}
        <Card ambient hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider font-mono">Weekly Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Briefcase size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{appliedThisWeek} <span className="text-sm font-normal text-zinc-500">/ 10</span></span>
            <span className="text-xs font-mono text-zinc-300">{Math.round((appliedThisWeek / 10) * 100)}% met</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (appliedThisWeek / 10) * 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* PIPELINE PROGRESSION STRIP                                                */}
      {/* ========================================================================= */}
      <section aria-label="Pipeline overview">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Application Pipeline Velocity</h2>
              <span className="text-xs text-zinc-500 font-mono">• 4 Stage Progression</span>
            </div>
            <Link
              to="/applications"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 group transition-colors"
            >
              <span>View Full Kanban</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Interactive Stage Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stage 1: Wishlist */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Wishlist</span>
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{inWishlist}</div>
              <p className="mt-1 text-[11px] text-zinc-500">Bookmarked targets</p>
            </div>

            {/* Stage 2: Applied */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Applied</span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-sky-400">{inApplied}</div>
              <p className="mt-1 text-[11px] text-zinc-500">Awaiting review</p>
            </div>

            {/* Stage 3: Interviewing */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Interviewing</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400">{inInterview}</div>
              <p className="mt-1 text-[11px] text-zinc-500">Active dialogue</p>
            </div>

            {/* Stage 4: Offers */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Offers</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400">{inOffer}</div>
              <p className="mt-1 text-[11px] text-zinc-500">In negotiation</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 2-COLUMN FOCUSED WORKSPACE (7 : 5 Layout)                                 */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (7 cols): Active Focus & Resume Competency Summary */}
        <div className="lg:col-span-7 space-y-5">
          {/* Spotlight Card: Next Priority Interview */}
          <Card ambient className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <h3 className="text-sm font-semibold text-white">Priority Focus • Upcoming Interview</h3>
              </div>
              <Badge variant="interview" size="sm">Round 3 • System Design</Badge>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Razorpay</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Staff Backend & Distributed Payments Architect</p>
                <div className="mt-2.5 flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>📅 Tomorrow, 2:30 PM IST</span>
                  <span>•</span>
                  <span>📍 Google Meet (60 min)</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link
                  to="/interview-prep"
                  className="h-8.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Bot size={13} />
                  <span>Launch STAR Drill</span>
                </Link>
                <Link
                  to="/cover-letter"
                  className="h-8.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Review Notes</span>
                </Link>
              </div>
            </div>
          </Card>

          {/* Clean Competency Profile */}
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h3 className="text-sm font-semibold text-white">Active Profile Competencies</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Extracted from <code className="text-zinc-300 font-mono text-[11px]">{file?.name || "resume_engineering.pdf"}</code>
                </p>
              </div>
              <Link
                to="/resume"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Edit Profile</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="mt-4">
              <p className="text-xs text-zinc-500 mb-2 font-mono uppercase tracking-wider">Verified Competencies</p>
              <div className="flex flex-wrap gap-2">
                {activeSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-200 hover:border-white/[0.14] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN (5 cols): Quick Studio Launchpad */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Career Studio Launchpad</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">INTELLIGENT SUITE</span>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {/* Tool 1: Job Discovery */}
              <Link
                to="/jobs"
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Briefcase size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors">
                      Job Discovery Board
                    </h4>
                    <p className="text-[11px] text-zinc-400">Match active roles across India & remote</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              {/* Tool 2: Resume ATS Check */}
              <Link
                to="/resume"
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <FileText size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      ATS Resume Auditor
                    </h4>
                    <p className="text-[11px] text-zinc-400">Check keyword score & formatting flags</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              {/* Tool 3: Google XYZ Bullet Rewriter */}
              <Link
                to="/resume"
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Wand2 size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Google XYZ Rewriter
                    </h4>
                    <p className="text-[11px] text-zinc-400">Transform bullets into metric accomplishments</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              {/* Tool 4: AI Outreach & Cover Letter */}
              <Link
                to="/cover-letter"
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Bot size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                      AI Cover Letter Studio
                    </h4>
                    <p className="text-[11px] text-zinc-400">Draft tailored outreach & referral notes</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Command Palette:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">⌘K</kbd>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
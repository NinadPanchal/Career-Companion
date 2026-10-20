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
} from "lucide-react";
import { jobsService, ApplicationStats } from "../../features/jobs/services/jobs.service";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { Card, Button, Badge, MatchGauge } from "../../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const { analysis } = useResumeStore();
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
    ? analysis.skills.slice(0, 6)
    : ["React 19", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"];

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================================= */}
      {/* WELCOME HEADER & PRIMARY ACTIONS                                          */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-xs text-[#a1a1aa] font-medium">Search active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f4f4f5]">
            {getGreeting()}, <span className="text-white">Ninad</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#a1a1aa]">
            You have <span className="text-[#f4f4f5] font-medium">{inInterview} active interview rounds</span> in flight and{" "}
            <span className="text-[#10b981] font-medium">{appliedThisWeek} applications submitted</span> this week.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/resume"
            className="h-8 px-3 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.16] text-[#f4f4f5] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload size={13} className="text-[#71717a]" />
            <span>Update resume</span>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              navigate("/applications");
              setIsAddModalOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus size={13} />
            <span>New application</span>
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BALANCED METRIC CARDS                                                     */}
      {/* ========================================================================= */}
      <section aria-label="Key metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Metric 1: Total Tracked */}
        <Card hover className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs font-medium text-[#a1a1aa]">Total applications</span>
            <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#10b981]">
              <FolderOpen size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#f4f4f5] tabular-nums">{totalApps}</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded-[4px] border border-[#10b981]/20 font-medium">
              <TrendingUp size={11} />
              +4 this week
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717a]">
            <span>Active in pipeline</span>
            <span className="text-[#f4f4f5] font-medium">{inApplied + inInterview} active</span>
          </div>
        </Card>

        {/* Metric 2: Active Interviews */}
        <Card hover className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs font-medium text-[#a1a1aa]">Active interviews</span>
            <div className="w-7 h-7 rounded-[6px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#f59e0b]">
              <Clock size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#f4f4f5] tabular-nums">{inInterview}</span>
            <Badge variant="interview" size="sm">Next: Tomorrow</Badge>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717a]">
            <span className="truncate">Razorpay (System Arch)</span>
            <span className="text-[#f59e0b] font-medium">2:30 PM</span>
          </div>
        </Card>

        {/* Metric 3: Profile Match */}
        <Card hover className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs font-medium text-[#a1a1aa]">Average match rate</span>
            <div className="w-7 h-7 rounded-[6px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[#38bdf8]">
              <Zap size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <MatchGauge score={avgMatch} />
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717a]">
            <span>Core alignment</span>
            <span className="text-[#10b981] font-medium">Backend & Cloud</span>
          </div>
        </Card>

        {/* Metric 4: Weekly Goal */}
        <Card hover className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#71717a]">
            <span className="text-xs font-medium text-[#a1a1aa]">Weekly target</span>
            <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#f4f4f5]">
              <Briefcase size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#f4f4f5] tabular-nums">
              {appliedThisWeek} <span className="text-xs font-normal text-[#71717a]">/ 10 target</span>
            </span>
            <span className="text-xs text-[#a1a1aa] font-medium">{Math.round((appliedThisWeek / 10) * 100)}% met</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.06]">
            <div className="w-full bg-[#18181b] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[#10b981] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (appliedThisWeek / 10) * 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* APPLICATION STAGE PROGRESSION SUMMARY                                     */}
      {/* ========================================================================= */}
      <section aria-label="Application stages">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-sm font-semibold text-[#f4f4f5]">
                Application stages
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">Overview of active opportunities by status</p>
            </div>
            <Link
              to="/applications"
              className="text-xs text-[#10b981] hover:text-[#34d399] font-medium flex items-center gap-1 group transition-colors"
            >
              <span>View kanban board</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stage 1: Wishlist */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1.5 font-medium">
                <span>Wishlist</span>
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
              </div>
              <div className="text-xl font-bold font-mono text-[#f4f4f5] tabular-nums">{inWishlist}</div>
              <p className="mt-1 text-[11px] text-[#71717a]">Bookmarked roles</p>
            </div>

            {/* Stage 2: Applied */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1.5 font-medium">
                <span>Applied</span>
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#38bdf8] tabular-nums">{inApplied}</div>
              <p className="mt-1 text-[11px] text-[#71717a]">Awaiting recruiter response</p>
            </div>

            {/* Stage 3: Interviewing */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1.5 font-medium">
                <span>Interviewing</span>
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#f59e0b] tabular-nums">{inInterview}</div>
              <p className="mt-1 text-[11px] text-[#71717a]">Active interview rounds</p>
            </div>

            {/* Stage 4: Offers */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-1.5 font-medium">
                <span>Offers</span>
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              </div>
              <div className="text-xl font-bold font-mono text-[#10b981] tabular-nums">{inOffer}</div>
              <p className="mt-1 text-[11px] text-[#71717a]">Offers received</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN: UPCOMING INTERVIEWS & NEXT ACTIONS / RECENT ACTIVITY       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Upcoming Interview & Next Actions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Upcoming Interview Spotlight Card */}
          <Card className="p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="interview" size="sm">
                  Upcoming interview
                </Badge>
                <span className="text-xs text-[#a1a1aa]">Round 2: Technical Architecture</span>
              </div>
              <Link
                to="/interview-prep"
                className="text-xs text-[#10b981] hover:underline font-medium"
              >
                Prepare answers →
              </Link>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#09090b] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f4f4f5]">Razorpay • Distributed Systems Engineer</h3>
                <p className="text-xs text-[#a1a1aa] mt-1">
                  Focus: High-throughput idempotent ledger, Kafka partitioning, and database concurrency.
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                <span className="text-xs font-semibold text-[#f59e0b] block">Tomorrow, 2:30 PM</span>
                <span className="text-[11px] text-[#71717a]">Google Meet (45 mins)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#71717a]">Practice answering with the STAR method</span>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => navigate("/interview-prep")}
                className="gap-1.5"
              >
                <Bot size={13} className="text-[#10b981]" />
                <span>Open STAR simulator</span>
              </Button>
            </div>
          </Card>

          {/* Next Actions & Priorities */}
          <Card className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f4f4f5]">
                Recommended next actions
              </h2>
              <span className="text-xs text-[#71717a]">Based on pipeline status</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-[8px] bg-[#09090b] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.14] transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#f4f4f5]">Prepare for Razorpay architecture drill</p>
                  <p className="text-[11px] text-[#71717a]">Practice STAR answers for system design & reliability questions.</p>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => navigate("/interview-prep")}
                  className="shrink-0"
                >
                  Start drill
                </Button>
              </div>

              <div className="p-3 rounded-[8px] bg-[#09090b] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.14] transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#f4f4f5]">Review 4 new high-match positions</p>
                  <p className="text-[11px] text-[#71717a]">Matching backend & distributed systems skills at 85%+ parity.</p>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => navigate("/jobs")}
                  className="shrink-0"
                >
                  Browse roles
                </Button>
              </div>

              <div className="p-3 rounded-[8px] bg-[#09090b] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.14] transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#f4f4f5]">Send outreach pitch for Zepto referral</p>
                  <p className="text-[11px] text-[#71717a]">Generate a personalized LinkedIn note using Outreach Studio.</p>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => navigate("/cover-letter")}
                  className="shrink-0"
                >
                  Draft message
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Recent Activity & Tools Launchpad */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recent Activity Feed */}
          <Card className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f4f4f5]">
                Recent activity
              </h2>
              <span className="text-xs text-[#71717a]">Timeline</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#f4f4f5] font-medium truncate">Razorpay scheduled Round 2 Interview</p>
                  <p className="text-[#71717a] text-[11px]">Technical Architecture on Google Meet • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#f4f4f5] font-medium truncate">Applied to Zepto</p>
                  <p className="text-[#71717a] text-[11px]">Senior Backend Engineer • Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#f4f4f5] font-medium truncate">Offer letter received from Postman</p>
                  <p className="text-[#71717a] text-[11px]">Frontend Architect • 3 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#f4f4f5] font-medium truncate">Resume parsed & competencies verified</p>
                  <p className="text-[#71717a] text-[11px]">10 core skills indexed • 4 days ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Tools Launchpad */}
          <Card className="p-4 sm:p-5 space-y-2.5">
            <h2 className="text-sm font-semibold text-[#f4f4f5]">
              Quick tools
            </h2>

            <div className="space-y-1.5">
              <Link
                to="/resume"
                className="p-2.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] text-[#10b981] flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#10b981] transition-colors">
                      Resume & ATS audit
                    </p>
                    <p className="text-[11px] text-[#71717a]">Rewrite accomplishment bullets with Google XYZ</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-[#71717a] group-hover:text-[#f4f4f5]" />
              </Link>

              <Link
                to="/jobs"
                className="p-2.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] text-[#38bdf8] flex items-center justify-center">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#38bdf8] transition-colors">
                      Job discovery & matching
                    </p>
                    <p className="text-[11px] text-[#71717a]">Browse curated roles with live profile compatibility</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-[#71717a] group-hover:text-[#f4f4f5]" />
              </Link>

              <Link
                to="/cover-letter"
                className="p-2.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] text-[#f59e0b] flex items-center justify-center">
                    <Wand2 size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f4f4f5] group-hover:text-[#f59e0b] transition-colors">
                      Outreach & cover letter
                    </p>
                    <p className="text-[11px] text-[#71717a]">Tailored pitches and referral requests</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-[#71717a] group-hover:text-[#f4f4f5]" />
              </Link>

              <Link
                to="/interview-prep"
                className="p-2.5 rounded-[8px] bg-[#09090b] hover:bg-[#18181b] border border-white/[0.08] hover:border-white/[0.14] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[6px] bg-white/[0.04] text-[#a1a1aa] flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#f4f4f5] group-hover:text-white transition-colors">
                      STAR interview simulator
                    </p>
                    <p className="text-[11px] text-[#71717a]">Timed practice with structured rubrics</p>
                  </div>
                </div>
                <ChevronRight size={13} className="text-[#71717a] group-hover:text-[#f4f4f5]" />
              </Link>
            </div>
          </Card>

          {/* Active Profile Skills */}
          <Card className="p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f4f4f5]">
                Verified profile skills
              </h2>
              <Link to="/resume" className="text-xs text-[#10b981] hover:underline font-medium">
                Manage skills →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-[6px] bg-[#09090b] text-[#d4d4d8] border border-white/[0.08] text-xs font-mono"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
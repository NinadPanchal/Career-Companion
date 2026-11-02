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
    <div className="space-y-[var(--space-5)] select-none">
      {/* ========================================================================= */}
      {/* WELCOME HEADER & PRIMARY ACTIONS                                          */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-[var(--space-4)] border-b border-[var(--divider)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
            <span className="text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
              Search active
            </span>
          </div>
          <h1 className="text-[var(--text-2xl)] font-semibold tracking-tight text-[var(--text)]">
            {getGreeting()}, <span className="text-[var(--accent)]">Ninad</span>
          </h1>
          <p className="mt-1 text-[var(--text-sm)] text-[var(--text-muted)]">
            You have{" "}
            <span className="text-[var(--text)] font-semibold">
              {inInterview} active interview rounds
            </span>{" "}
            in flight and{" "}
            <span className="text-[var(--success)] font-semibold">
              {appliedThisWeek} applications submitted
            </span>{" "}
            this week.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/resume"
            className="h-9 px-3.5 rounded-[var(--radius-md)] glass text-[var(--text)] text-[var(--text-xs)] font-medium flex items-center gap-1.5 hover:bg-[var(--glass-bg-strong)] transition-all cursor-pointer"
          >
            <Upload size={14} className="text-[var(--text-muted)]" />
            <span>Update resume</span>
          </Link>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              navigate("/applications");
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus size={14} />}
          >
            New application
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BALANCED METRIC CARDS (design.md Section 6)                               */}
      {/* ========================================================================= */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[var(--space-3)]"
      >
        {/* Metric 1: Total Tracked */}
        <Card hover className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Total applications</span>
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)]">
              <FolderOpen size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[var(--text-2xl)] font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {totalApps}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-1.5 py-0.5 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)] font-medium">
              <TrendingUp size={11} />
              +4 this week
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span>Active in pipeline</span>
            <span className="text-[var(--text)] font-medium">
              {inApplied + inInterview} active
            </span>
          </div>
        </Card>

        {/* Metric 2: Active Interviews */}
        <Card hover className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Active interviews</span>
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] flex items-center justify-center text-[var(--warning)]">
              <Clock size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[var(--text-2xl)] font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {inInterview}
            </span>
            <Badge variant="interview" size="sm">
              Next: Tomorrow
            </Badge>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span className="truncate">Razorpay (System Arch)</span>
            <span className="text-[var(--warning)] font-medium font-mono">2:30 PM</span>
          </div>
        </Card>

        {/* Metric 3: Profile Match */}
        <Card hover className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Average match rate</span>
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--status-applied)_12%,transparent)] border border-[color-mix(in_srgb,var(--status-applied)_24%,transparent)] flex items-center justify-center text-[var(--status-applied)]">
              <Zap size={14} />
            </div>
          </div>
          <div className="mt-2.5">
            <MatchGauge score={avgMatch} />
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span>Core alignment</span>
            <span className="text-[var(--success)] font-medium">Backend & Cloud</span>
          </div>
        </Card>

        {/* Metric 4: Weekly Goal */}
        <Card hover className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Weekly target</span>
            <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text)]">
              <Briefcase size={14} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[var(--text-2xl)] font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {appliedThisWeek}{" "}
              <span className="text-[var(--text-xs)] font-normal text-[var(--text-muted)]">
                / 10 target
              </span>
            </span>
            <span className="text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
              {Math.round((appliedThisWeek / 10) * 100)}% met
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[var(--divider)]">
            <div className="w-full bg-[var(--glass-border)] h-[3px] rounded-full overflow-hidden">
              <div
                className="bg-[var(--accent)] h-full rounded-full transition-all duration-300"
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
        <Card>
          <div className="flex items-center justify-between mb-[var(--space-4)]">
            <div>
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Application stages
              </h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-0.5">
                Overview of active opportunities by status
              </p>
            </div>
            <Link
              to="/applications"
              className="text-[var(--text-xs)] text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium flex items-center gap-1 group transition-colors"
            >
              <span>View kanban board</span>
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-3)]">
            {/* Stage 1: Wishlist */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] mb-1.5 font-medium">
                <span>Wishlist</span>
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
              </div>
              <div className="text-[var(--text-xl)] font-bold font-mono text-[var(--text)] tabular-nums">
                {inWishlist}
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-faint)]">Bookmarked roles</p>
            </div>

            {/* Stage 2: Applied */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] mb-1.5 font-medium">
                <span>Applied</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-applied)]" />
              </div>
              <div className="text-[var(--text-xl)] font-bold font-mono text-[var(--status-applied)] tabular-nums">
                {inApplied}
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                Awaiting response
              </p>
            </div>

            {/* Stage 3: Interviewing */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] mb-1.5 font-medium">
                <span>Interviewing</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-interview)]" />
              </div>
              <div className="text-[var(--text-xl)] font-bold font-mono text-[var(--status-interview)] tabular-nums">
                {inInterview}
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                Active interview rounds
              </p>
            </div>

            {/* Stage 4: Offers */}
            <div
              onClick={() => navigate("/applications")}
              className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] mb-1.5 font-medium">
                <span>Offers</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-offer)]" />
              </div>
              <div className="text-[var(--text-xl)] font-bold font-mono text-[var(--status-offer)] tabular-nums">
                {inOffer}
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-faint)]">Offers received</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN: UPCOMING INTERVIEWS & ACTIONS / ACTIVITY                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-4)]">
        {/* Left Column (7 cols): Upcoming Interview & Next Actions */}
        <div className="lg:col-span-7 space-y-[var(--space-4)]">
          {/* Upcoming Interview Spotlight Card */}
          <Card className="space-y-[var(--space-3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="interview" size="sm">
                  Upcoming interview
                </Badge>
                <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                  Round 2: Technical Architecture
                </span>
              </div>
              <Link
                to="/interview-prep"
                className="text-[var(--text-xs)] text-[var(--accent)] hover:underline font-medium"
              >
                Prepare answers →
              </Link>
            </div>

            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                  Razorpay • Distributed Systems Engineer
                </h3>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1">
                  Focus: High-throughput idempotent ledger, Kafka partitioning, and database
                  concurrency.
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--divider)]">
                <span className="text-[var(--text-xs)] font-semibold text-[var(--warning)] font-mono block">
                  Tomorrow, 2:30 PM
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Google Meet (45 mins)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Practice answering with the STAR method
              </span>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => navigate("/interview-prep")}
                leftIcon={<Bot size={13} className="text-[var(--accent)]" />}
              >
                Open STAR simulator
              </Button>
            </div>
          </Card>

          {/* Next Actions & Priorities */}
          <Card className="space-y-[var(--space-3)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Recommended next actions
              </h2>
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Based on pipeline status
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-3 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Prepare for Razorpay architecture drill
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Practice STAR answers for system design & reliability questions.
                  </p>
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

              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-3 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Review 4 new high-match positions
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Matching backend & distributed systems skills at 85%+ parity.
                  </p>
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

              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-3 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Send outreach pitch for Zepto referral
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Generate a personalized LinkedIn note using Outreach Studio.
                  </p>
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
        <div className="lg:col-span-5 space-y-[var(--space-4)]">
          {/* Recent Activity Feed */}
          <Card className="space-y-[var(--space-3)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Recent activity
              </h2>
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">Timeline</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-[var(--text-xs)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-medium truncate">
                    Razorpay scheduled Round 2 Interview
                  </p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Technical Architecture on Google Meet • 2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[var(--text-xs)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--status-applied)] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-medium truncate">Applied to Zepto</p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Senior Backend Engineer • Yesterday
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[var(--text-xs)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-medium truncate">
                    Offer letter received from Postman
                  </p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    Frontend Architect • 3 days ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-[var(--text-xs)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text)] font-medium truncate">
                    Resume parsed & competencies verified
                  </p>
                  <p className="text-[var(--text-muted)] text-[11px]">
                    10 core skills indexed • 4 days ago
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Tools Launchpad */}
          <Card className="space-y-[var(--space-2)]">
            <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
              Quick tools
            </h2>

            <div className="space-y-1.5">
              <Link
                to="/resume"
                className="p-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      Resume & ATS audit
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Rewrite accomplishment bullets with Google XYZ
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
                />
              </Link>

              <Link
                to="/jobs"
                className="p-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] flex items-center justify-center">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      Job discovery & matching
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Browse curated roles with live profile compatibility
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
                />
              </Link>

              <Link
                to="/cover-letter"
                className="p-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--warning)] flex items-center justify-center">
                    <Wand2 size={14} />
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      Outreach & cover letter
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Tailored pitches and referral requests
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
                />
              </Link>

              <Link
                to="/interview-prep"
                className="p-2.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] text-[var(--text-muted)] flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <div>
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      STAR interview simulator
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Timed practice with structured rubrics
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
                />
              </Link>
            </div>
          </Card>

          {/* Active Profile Skills */}
          <Card className="space-y-[var(--space-2)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Verified profile skills
              </h2>
              <Link
                to="/resume"
                className="text-[var(--text-xs)] text-[var(--accent)] hover:underline font-medium"
              >
                Manage skills →
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] text-[var(--text)] border border-[var(--glass-border)] text-[var(--text-xs)] font-mono"
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

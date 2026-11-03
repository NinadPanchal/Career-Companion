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
import { useProfileStore } from "../../features/profile/stores/profile.store";
import { useApplicationsStore } from "../../features/applications/stores/applications.store";
import { Card, Button, Badge, MatchGauge } from "../../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const { analysis } = useResumeStore();
  const { profile } = useProfileStore();
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
        total: 0,
        by_status: { applied: 0, interview: 0, offer: 0, discovered: 0 },
        avg_match_score: 0,
        applied_this_week: 0,
        applied_this_month: 0,
      });
    }
  };

  const totalApps = stats?.total ?? 0;
  const appliedThisWeek = stats?.applied_this_week ?? 0;
  const inInterview = stats?.by_status?.interview ?? 0;
  const inOffer = stats?.by_status?.offer ?? 0;
  const inWishlist = stats?.by_status?.discovered ?? 0;
  const inApplied = stats?.by_status?.applied ?? 0;
  const avgMatch = stats?.avg_match_score ? Math.round(Number(stats.avg_match_score)) : (profile?.ats_score || 85);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const activeSkills = profile?.skills?.length
    ? profile.skills.slice(0, 8)
    : analysis?.skills?.length
    ? analysis.skills.slice(0, 8)
    : [];

  const candidateFirstName = profile?.name ? profile.name.split(" ")[0] : "Candidate";

  return (
    <div className="flex flex-col gap-8 select-none pb-12">
      {/* ========================================================================= */}
      {/* WELCOME HEADER & PRIMARY ACTIONS                                          */}
      {/* ========================================================================= */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--divider)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
            <span className="text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
              Search active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)]">
            {getGreeting()}, <span className="text-[var(--accent)]">{candidateFirstName}</span>
          </h1>
          <p className="mt-2 text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
            {totalApps > 0 ? (
              <>
                You have{" "}
                <span className="text-[var(--text)] font-semibold">
                  {inInterview} active interview rounds
                </span>{" "}
                in flight and{" "}
                <span className="text-[var(--success)] font-semibold">
                  {appliedThisWeek} applications submitted
                </span>{" "}
                this week.
              </>
            ) : (
              <>
                Your profile is active with{" "}
                <span className="text-[var(--text)] font-semibold">
                  {activeSkills.length} verified skills
                </span>
                . Discover curated roles or track your first application below.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="secondary" size="md">
            <Link to="/resume">
              <Upload size={15} />
              <span>Update resume</span>
            </Link>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              navigate("/applications");
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus size={15} />}
          >
            New application
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BALANCED METRIC CARDS (Step 2: padding 20px, label-to-value 8px)          */}
      {/* ========================================================================= */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        {/* Metric 1: Total Tracked */}
        <Card hover className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Total applications</span>
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <FolderOpen size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {totalApps}
            </span>
            {totalApps > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-2 py-0.5 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)] font-medium whitespace-nowrap">
                <TrendingUp size={12} className="shrink-0" />
                +{appliedThisWeek} this week
              </span>
            ) : (
              <span className="text-xs text-[var(--text-muted)] font-medium">Ready</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span>Active in pipeline</span>
            <span className="text-[var(--text)] font-medium">
              {inApplied + inInterview} active
            </span>
          </div>
        </Card>

        {/* Metric 2: Active Interviews */}
        <Card hover className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Active interviews</span>
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] border border-[color-mix(in_srgb,var(--warning)_24%,transparent)] flex items-center justify-center text-[var(--warning)] shrink-0">
              <Clock size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {inInterview}
            </span>
            <Badge variant={inInterview > 0 ? "interview" : "neutral"} size="sm">
              {inInterview > 0 ? "Active round" : "None scheduled"}
            </Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span className="truncate">
              {inInterview > 0 ? "Upcoming technical round" : "No active interviews"}
            </span>
            <span className="text-[var(--text-faint)] font-mono shrink-0">—</span>
          </div>
        </Card>

        {/* Metric 3: Profile Match */}
        <Card hover className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Average match rate</span>
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--status-applied)_12%,transparent)] border border-[color-mix(in_srgb,var(--status-applied)_24%,transparent)] flex items-center justify-center text-[var(--status-applied)] shrink-0">
              <Zap size={15} />
            </div>
          </div>
          <div className="mt-2">
            <MatchGauge score={avgMatch} />
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)]">
            <span>Core alignment</span>
            <span className="text-[var(--success)] font-medium truncate max-w-[140px]">
              {profile?.headline ? profile.headline.split("|")[0].trim() : "Full Stack & Cloud"}
            </span>
          </div>
        </Card>

        {/* Metric 4: Weekly Goal */}
        <Card hover className="p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[var(--text-xs)] font-medium">Weekly target</span>
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--text)] shrink-0">
              <Briefcase size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[var(--text)] tabular-nums">
              {appliedThisWeek}{" "}
              <span className="text-[var(--text-xs)] font-normal text-[var(--text-muted)]">
                / 10 target
              </span>
            </span>
            <span className="text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
              {Math.round((appliedThisWeek / 10) * 100)}% met
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--divider)]">
            <div className="w-full bg-[var(--glass-border)] h-[4px] rounded-full overflow-hidden">
              <div
                className="bg-[var(--accent)] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (appliedThisWeek / 10) * 100)}%` }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* APPLICATION STAGE PROGRESSION SUMMARY (Step 2: gap 16px, padding 16px)   */}
      {/* ========================================================================= */}
      <section aria-label="Application stages">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Application stages
              </h2>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1">
                Overview of active opportunities by status
              </p>
            </div>
            <Button asChild variant="link" size="sm" className="p-0 h-auto">
              <Link
                to="/applications"
                className="text-[var(--text-xs)] text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium inline-flex items-center gap-1.5 group transition-colors"
              >
                <span>View kanban board</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stage 1: Wishlist */}
            <div
              onClick={() => navigate("/applications")}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
                <span>Wishlist</span>
                <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] shrink-0" />
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--text)] tabular-nums">
                {inWishlist}
              </div>
              <p className="text-[11px] text-[var(--text-faint)]">Bookmarked roles</p>
            </div>

            {/* Stage 2: Applied */}
            <div
              onClick={() => navigate("/applications")}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
                <span>Applied</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-applied)] shrink-0" />
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--status-applied)] tabular-nums">
                {inApplied}
              </div>
              <p className="text-[11px] text-[var(--text-faint)]">Awaiting response</p>
            </div>

            {/* Stage 3: Interviewing */}
            <div
              onClick={() => navigate("/applications")}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
                <span>Interviewing</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-interview)] shrink-0" />
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--status-interview)] tabular-nums">
                {inInterview}
              </div>
              <p className="text-[11px] text-[var(--text-faint)]">Active interview rounds</p>
            </div>

            {/* Stage 4: Offers */}
            <div
              onClick={() => navigate("/applications")}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] transition-all cursor-pointer group flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] font-medium">
                <span>Offers</span>
                <span className="w-2 h-2 rounded-full bg-[var(--status-offer)] shrink-0" />
              </div>
              <div className="text-2xl font-bold font-mono text-[var(--status-offer)] tabular-nums">
                {inOffer}
              </div>
              <p className="text-[11px] text-[var(--text-faint)]">Offers received</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN: UPCOMING INTERVIEWS & ACTIONS / ACTIVITY                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Upcoming Interview & Next Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Upcoming Interview Spotlight Card */}
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Badge variant={inInterview > 0 ? "interview" : "neutral"} size="sm">
                  {inInterview > 0 ? "Upcoming interview" : "Interview preparation"}
                </Badge>
                <span className="text-[var(--text-xs)] text-[var(--text-muted)] truncate">
                  {inInterview > 0 ? "Upcoming Technical Architecture" : "STAR Simulator & Rubrics"}
                </span>
              </div>
              <Button asChild variant="link" size="sm" className="p-0 h-auto shrink-0">
                <Link
                  to="/interview-prep"
                  className="text-[var(--text-xs)] text-[var(--accent)] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Practice answers</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </Button>
            </div>

            {inInterview > 0 ? (
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                    Active Interview In Flight
                  </h3>
                  <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    Focus: High-throughput architecture, Kafka partitioning, and database concurrency.
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--divider)]">
                  <span className="text-[var(--text-xs)] font-semibold text-[var(--warning)] font-mono block">
                    Upcoming Round
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                    Video Call (45 mins)
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                    No active interview rounds scheduled
                  </h3>
                  <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    Advance an opportunity to "Interviewing" on your kanban board to activate practice drills and timeline reminders.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate("/applications")}>
                  Track application
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Practice answering with the STAR method
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/interview-prep")}
                leftIcon={<Bot size={14} className="text-[var(--accent)] shrink-0" />}
              >
                Open STAR simulator
              </Button>
            </div>
          </Card>

          {/* Next Actions & Priorities */}
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Recommended next actions
              </h2>
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                Based on profile skills
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-4 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Explore high-match job opportunities
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Discover open positions automatically matched to your indexed skills.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/jobs")}
                  className="shrink-0"
                >
                  Browse roles
                </Button>
              </div>

              <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-4 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Audit & optimize accomplishment bullets
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Rewrite bullets using the Google XYZ framework (Accomplished [X] as measured by [Y] by doing [Z]).
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/resume")}
                  className="shrink-0"
                >
                  Optimize bullets
                </Button>
              </div>

              <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-between gap-4 hover:bg-[var(--glass-bg-strong)] transition-colors">
                <div className="min-w-0 flex flex-col gap-1">
                  <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                    Generate tailored outreach notes
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Draft personalized referral pitches and recruiter notes in Outreach Studio.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
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
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Recent Activity Feed */}
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Recent activity
              </h2>
              <span className="text-[var(--text-xs)] text-[var(--text-muted)]">Timeline</span>
            </div>

            {totalApps === 0 ? (
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-center py-6">
                <p className="text-[var(--text-xs)] font-medium text-[var(--text)]">
                  No application activity recorded yet
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Your pipeline activity and milestones will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3 text-[var(--text-xs)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--status-applied)] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <p className="text-[var(--text)] font-medium truncate">Active application tracked</p>
                    <p className="text-[var(--text-muted)] text-[11px]">
                      {appliedThisWeek} submitted this week
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Tools Launchpad */}
          <Card className="p-6 flex flex-col gap-3.5">
            <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
              Quick tools
            </h2>

            <div className="flex flex-col gap-2">
              <Link
                to="/resume"
                className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] flex items-center justify-center shrink-0">
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                      Resume & ATS audit
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      Rewrite accomplishment bullets with Google XYZ
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0 ml-2"
                />
              </Link>

              <Link
                to="/jobs"
                className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] flex items-center justify-center shrink-0">
                    <Zap size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                      Job discovery & matching
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      Browse curated roles with live profile compatibility
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0 ml-2"
                />
              </Link>

              <Link
                to="/cover-letter"
                className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] text-[var(--warning)] flex items-center justify-center shrink-0">
                    <Wand2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                      Outreach & cover letter
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      Tailored pitches and referral requests
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0 ml-2"
                />
              </Link>

              <Link
                to="/interview-prep"
                className="p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] text-[var(--text-muted)] flex items-center justify-center shrink-0">
                    <Bot size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[var(--text-xs)] font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors truncate">
                      STAR interview simulator
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">
                      Timed practice with structured rubrics
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0 ml-2"
                />
              </Link>
            </div>
          </Card>

          {/* Active Profile Skills (Step 2: padding 6px 12px, gap 8px) */}
          <Card className="p-6 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                Verified profile skills
              </h2>
              <Button asChild variant="link" size="sm" className="p-0 h-auto">
                <Link
                  to="/resume"
                  className="text-[var(--text-xs)] text-[var(--accent)] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <span>Manage skills</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] text-[var(--text)] border border-[var(--glass-border)] text-xs font-mono whitespace-nowrap"
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

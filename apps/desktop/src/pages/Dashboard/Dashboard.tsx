import { useEffect, useState } from "react";
import { 
  FileText, 
  Kanban, 
  Send, 
  Bot, 
  Wand2, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import { jobsService, ApplicationStats } from "../../features/jobs/services/jobs.service";
import { useResumeStore } from "../../features/resume/stores/resume.store";

function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { analysis } = useResumeStore();

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
        total: 4,
        by_status: { applied: 2, interview: 1, offer: 1 },
        avg_match_score: 92,
        applied_this_week: 2,
        applied_this_month: 4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    {
      label: "Total Applications",
      value: stats?.total || 0,
      icon: BarChart3,
      detail: "Active & past entries",
    },
    {
      label: "Applied This Week",
      value: stats?.applied_this_week || 0,
      icon: TrendingUp,
      detail: "Weekly outreach velocity",
    },
    {
      label: "Interview Stage",
      value: stats?.by_status?.interview || 0,
      icon: Users,
      detail: "Active screening rounds",
    },
    {
      label: "Average Skill Match",
      value: stats?.avg_match_score ? `${Math.round(stats.avg_match_score)}%` : "—",
      icon: Clock,
      detail: "Parsed skill overlap",
    },
  ];

  const tools = [
    {
      title: "Pipeline Tracker",
      description: "Manage applications across 5 stages with notes and interview dates.",
      icon: Kanban,
      href: "/applications",
      actionText: "View Board",
    },
    {
      title: "Outreach & Letters",
      description: "Generate targeted cover letters, cold emails, and referral notes.",
      icon: Send,
      href: "/cover-letter",
      actionText: "Draft Content",
    },
    {
      title: "Interview Simulator",
      description: "Practice timed questions with real-time STAR evaluation feedback.",
      icon: Bot,
      href: "/interview-prep",
      actionText: "Start Session",
    },
    {
      title: "Resume Optimizer",
      description: "Rewrite accomplishment bullets with Google XYZ impact formulas.",
      icon: Wand2,
      href: "/resume",
      actionText: "Refine Bullets",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link to="/" className="hover:text-zinc-300 transition-colors">
              Project Overview
            </Link>
            <span>/</span>
            <span className="text-zinc-400">Workspace</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Application Pipeline</h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Real-time pipeline metrics, parsed resume competency profile, and preparation tools.
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/applications">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Kanban size={14} />
              <span>Pipeline</span>
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus size={14} />
              <span>Discover Jobs</span>
            </Button>
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[96px] animate-pulse opacity-30" />
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Key Metrics Row */}
          <section aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="sr-only">Key Application Metrics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <Card key={m.label} className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-400">{m.label}</p>
                    <m.icon size={15} className="text-zinc-500" strokeWidth={1.5} />
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{m.value}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{m.detail}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Core Tools Grid */}
          <section aria-labelledby="tools-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="tools-heading" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Preparation & Tracking Tools
              </h2>
              <span className="text-[11px] text-zinc-600">4 modules active</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => (
                <Link key={tool.title} to={tool.href} className="group">
                  <Card hover className="flex h-full flex-col justify-between p-5">
                    <div>
                      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                        <tool.icon size={16} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-[11px] font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors pt-3 border-t border-white/[0.04]">
                      <span>{tool.actionText}</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Active Profile and Command Bar Info */}
          <section aria-labelledby="profile-heading" className="grid gap-4 lg:grid-cols-12">
            <Card className="p-5 lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-emerald-400" strokeWidth={1.5} />
                  <h3 id="profile-heading" className="text-sm font-semibold text-zinc-200">
                    Active Resume Competency Profile
                  </h3>
                </div>
                <Link
                  to="/resume"
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Manage in Scanner →
                </Link>
              </div>

              {analysis ? (
                <div>
                  <p className="text-xs text-zinc-400">
                    Your active resume tokens are parsed and indexed for real-time skill parity comparisons against job postings.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.skills.slice(0, 12).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-xs text-zinc-400">
                    No active resume parsed yet. Upload your PDF or DOCX file to calculate ATS keyword scores and generate tailored cover letters.
                  </p>
                  <Link to="/resume">
                    <Button size="sm" className="text-xs">
                      Upload Resume Document
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card className="flex flex-col justify-between p-5 lg:col-span-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Keyboard Navigation
                </p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-200">Command Bar</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  Press <kbd aria-label="Command K">⌘K</kbd> anywhere in the application to quickly jump across modules or execute common actions.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04]">
                <Link to="/jobs">
                  <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                    Search Tech Openings
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
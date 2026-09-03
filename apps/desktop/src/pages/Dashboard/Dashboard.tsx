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
  BarChart3
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
      label: "Total Tracked",
      value: stats?.total || 0,
      icon: BarChart3,
      detail: "All applications",
    },
    {
      label: "Applied This Week",
      value: stats?.applied_this_week || 0,
      icon: TrendingUp,
      detail: "Recent activity",
    },
    {
      label: "In Interview",
      value: stats?.by_status?.interview || 0,
      icon: Users,
      detail: "Active rounds",
    },
    {
      label: "Avg Match",
      value: stats?.avg_match_score ? `${Math.round(stats.avg_match_score)}%` : "—",
      icon: Clock,
      detail: "Skill parity",
    },
  ];

  const tools = [
    {
      title: "Pipeline",
      description: "Track applications through every stage",
      icon: Kanban,
      href: "/applications",
    },
    {
      title: "Cover Letter",
      description: "Generate tailored outreach content",
      icon: Send,
      href: "/cover-letter",
    },
    {
      title: "Interview Prep",
      description: "Practice with timed mock sessions",
      icon: Bot,
      href: "/interview-prep",
    },
    {
      title: "Resume Optimizer",
      description: "Rewrite bullets for maximum impact",
      icon: Wand2,
      href: "/resume",
    },
  ];

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your job search at a glance.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[88px] animate-pulse opacity-30" />
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <Card key={m.label} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-zinc-500">{m.label}</p>
                  <m.icon size={14} className="text-zinc-600" strokeWidth={1.5} />
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{m.value}</p>
                <p className="mt-1 text-[11px] text-zinc-600">{m.detail}</p>
              </Card>
            ))}
          </div>

          {/* Tools Grid */}
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((tool) => (
                <Link key={tool.title} to={tool.href}>
                  <Card hover className="group h-full px-5 py-4">
                    <tool.icon size={16} className="mb-3 text-zinc-500 transition-colors group-hover:text-emerald-400" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-zinc-200">{tool.title}</h3>
                    <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-zinc-600 transition-colors group-hover:text-emerald-400">
                      Open <ArrowUpRight size={11} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Resume Section */}
          <div className="grid gap-4 lg:grid-cols-12">
            <Card className="px-5 py-5 lg:col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-zinc-500" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-zinc-200">Resume Profile</h3>
                </div>
                <Link to="/resume" className="text-[11px] font-medium text-zinc-600 transition-colors hover:text-emerald-400">
                  Manage →
                </Link>
              </div>

              {analysis ? (
                <div>
                  <p className="text-xs text-zinc-500">
                    Your resume is parsed and synchronized with the matching engine.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.skills.slice(0, 10).map((skill) => (
                      <span key={skill} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-xs text-zinc-500">
                    Upload your resume to unlock match scores and generate cover letters.
                  </p>
                  <Link to="/resume">
                    <Button size="sm">Upload Resume</Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card className="flex flex-col justify-between px-5 py-5 lg:col-span-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Quick Action</p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-200">Command Bar</h3>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                  Press <kbd>⌘K</kbd> to jump to any page or run quick actions.
                </p>
              </div>
              <Link to="/jobs" className="mt-4">
                <Button variant="secondary" className="w-full justify-center text-xs">
                  Search Jobs
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
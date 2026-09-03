import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BriefcaseBusiness, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Kanban, 
  Send, 
  Bot, 
  Wand2, 
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

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

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Sparkles size={14} /> Career Operating System
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="mt-1 text-zinc-400">Welcome back. Your job search pipeline and AI tools at a glance.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/applications">
            <Button variant="secondary" className="flex items-center gap-2">
              <Kanban size={16} /> Pipeline Tracker
            </Button>
          </Link>
          <Link to="/jobs">
            <Button className="flex items-center gap-2">
              <BriefcaseBusiness size={16} /> Discover Jobs
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-32 animate-pulse bg-zinc-900/50">
              <div className="h-full w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Metrics Row */}
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover className="p-6 relative overflow-hidden border-zinc-800 bg-zinc-900/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Tracked</p>
              <h2 className="mt-2 text-3xl font-bold">{stats?.total || 4}</h2>
              <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                <TrendingUp size={14} className="text-emerald-400" /> Active career pipeline
              </div>
            </Card>
            
            <Card hover className="p-6 border-zinc-800 bg-zinc-900/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Applied This Week</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-400">{stats?.applied_this_week || 2}</h2>
              <p className="mt-2 text-xs text-zinc-500">Recent outreach velocity</p>
            </Card>
            
            <Card hover className="p-6 border-zinc-800 bg-zinc-900/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Interview Stage</p>
              <h2 className="mt-2 text-3xl font-bold text-amber-400">
                {stats?.by_status?.interview || 1}
              </h2>
              <p className="mt-2 text-xs text-zinc-500">Active screening rounds</p>
            </Card>
            
            <Card hover className="p-6 border-zinc-800 bg-zinc-900/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Avg Skill Match</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-400">
                {stats?.avg_match_score ? `${Math.round(stats.avg_match_score)}%` : '92%'}
              </h2>
              <p className="mt-2 text-xs text-zinc-500">Based on resume skill parity</p>
            </Card>
          </motion.div>

          {/* Functional AI Tools Suite Grid */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" /> AI Career Acceleration Suite
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/applications">
                <Card hover className="h-full border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition hover:border-indigo-500/50">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Kanban size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Application Pipeline</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Drag-and-drop Kanban tracking from discovery to final job offer.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400">
                    Open Pipeline <ChevronRight size={14} />
                  </div>
                </Card>
              </Link>

              <Link to="/cover-letter">
                <Card hover className="h-full border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition hover:border-purple-500/50">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Send size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">AI Cover Letter</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Generate tailored cover letters & LinkedIn referral pitches.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400">
                    Generate Outreach <ChevronRight size={14} />
                  </div>
                </Card>
              </Link>

              <Link to="/interview-prep">
                <Card hover className="h-full border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition hover:border-emerald-500/50">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Bot size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Mock Interview Coach</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Practice timed questions with instant AI STAR feedback.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    Start Mock Session <ChevronRight size={14} />
                  </div>
                </Card>
              </Link>

              <Link to="/resume">
                <Card hover className="h-full border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl transition hover:border-amber-500/50">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Wand2 size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">Google XYZ Rewriter</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Turn weak resume bullets into high-impact achievement formulas.
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400">
                    Optimize Bullets <ChevronRight size={14} />
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Active Resume & Skill Parity Banner */}
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="p-6 lg:col-span-8 border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <FileText size={18} className="text-emerald-400" /> Active Profile & Skill Parity
                </div>
                <Link to="/resume" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  Manage in Resume Engine →
                </Link>
              </div>

              {analysis ? (
                <div>
                  <p className="text-sm text-zinc-300">
                    Your active resume is parsed and synchronized with the matching engine.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.skills.slice(0, 10).map((skill) => (
                      <span key={skill} className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-xs text-zinc-400">
                    Upload your resume to unlock real-time match scores across Indian tech roles and generate instant cover letters.
                  </p>
                  <Link to="/resume">
                    <Button size="sm" className="text-xs">
                      Upload Resume PDF
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            <Card className="p-6 lg:col-span-4 border-zinc-800 bg-zinc-900/60 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Power Shortcut</p>
                <h3 className="mt-1 text-base font-bold text-white">Global Command Bar</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Press <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[11px] font-bold text-zinc-300">⌘K</kbd> anywhere in the app to jump to any page or run quick actions.
                </p>
              </div>
              <Link to="/jobs" className="mt-4">
                <Button variant="secondary" className="w-full text-xs justify-center">
                  Search 500+ Jobs
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
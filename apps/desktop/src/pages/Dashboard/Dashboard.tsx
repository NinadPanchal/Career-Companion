import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, CheckCircle, Clock, XCircle, TrendingUp, Sparkles, FileText, ArrowRight } from "lucide-react";
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
      // Fallback state if API isn't running yet
      setStats({
        total: 0,
        by_status: {},
        avg_match_score: null,
        applied_this_week: 0,
        applied_this_month: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasNoData = !stats || stats.total === 0;

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Sparkles size={14} /> Career Overview
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-zinc-400">Welcome back to Career Companion.</p>
        </div>

        <div className="flex gap-3">
          <Link to="/resume">
            <Button variant="secondary" className="flex items-center gap-2">
              <FileText size={16} /> Resume Manager
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
      ) : hasNoData ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-12 text-center lg:col-span-2 border-dashed border-zinc-800">
            <div className="mb-4 rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
              <BriefcaseBusiness size={40} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Start discovering jobs to see your stats</h2>
            <p className="mb-6 max-w-md text-sm text-zinc-400">
              Search for roles, match your skills against descriptions using AI, and track your active job applications in one place.
            </p>
            <Link to="/jobs">
              <Button className="flex items-center gap-2">
                Find Matching Roles <ArrowRight size={16} />
              </Button>
            </Link>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <FileText size={16} /> Resume Status
              </div>
              {analysis ? (
                <div>
                  <p className="text-lg font-bold text-white">Active Resume Ready</p>
                  <p className="mt-1 text-xs text-zinc-400">{analysis.word_count} words analyzed</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {analysis.skills.slice(0, 6).map((skill) => (
                      <span key={skill} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                        {skill}
                      </span>
                    ))}
                    {analysis.skills.length > 6 && (
                      <span className="rounded-md bg-zinc-800/60 px-2 py-1 text-xs text-zinc-500">
                        +{analysis.skills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-white">No Resume Uploaded</p>
                  <p className="mt-1 text-xs text-zinc-400">Upload your resume to enable instant AI skill matching scores across job postings.</p>
                </div>
              )}
            </div>

            <Link to="/resume" className="mt-6">
              <Button variant="secondary" className="w-full justify-center text-sm">
                {analysis ? "Update Resume" : "Upload Resume Now"}
              </Button>
            </Link>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover className="p-6 relative overflow-hidden">
              <p className="text-sm font-medium text-zinc-400">Total Applications</p>
              <h2 className="mt-2 text-3xl font-bold">{stats?.total || 0}</h2>
              <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                <TrendingUp size={14} className="text-emerald-400" /> Active career search
              </div>
            </Card>
            
            <Card hover className="p-6">
              <p className="text-sm font-medium text-zinc-400">Applied This Week</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-400">{stats?.applied_this_week || 0}</h2>
              <p className="mt-2 text-xs text-zinc-500">Recent outreach activity</p>
            </Card>
            
            <Card hover className="p-6">
              <p className="text-sm font-medium text-zinc-400">Applied This Month</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-400">{stats?.applied_this_month || 0}</h2>
              <p className="mt-2 text-xs text-zinc-500">Monthly application volume</p>
            </Card>
            
            <Card hover className="p-6">
              <p className="text-sm font-medium text-zinc-400">Avg Match Score</p>
              <h2 className="mt-2 text-3xl font-bold text-blue-400">
                {stats?.avg_match_score ? `${Math.round(stats.avg_match_score)}%` : 'N/A'}
              </h2>
              <p className="mt-2 text-xs text-zinc-500">Based on resume skill parity</p>
            </Card>
          </motion.div>

          {stats?.by_status && Object.keys(stats.by_status).length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="mb-4 text-lg font-semibold">Application Status Breakdown</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(stats.by_status).map(([status, count]) => {
                  let icon = <Clock size={16} />;
                  let colorClass = "bg-zinc-800 text-zinc-300 border-zinc-700";
                  
                  if (status.toLowerCase().includes('reject')) {
                    icon = <XCircle size={16} />;
                    colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
                  } else if (status.toLowerCase().includes('offer') || status.toLowerCase().includes('accept')) {
                    icon = <CheckCircle size={16} />;
                    colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  } else if (status.toLowerCase().includes('interview')) {
                    icon = <Clock size={16} />;
                    colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  }

                  return (
                    <div key={status} className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 ${colorClass}`}>
                      {icon}
                      <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                      <span className="ml-2 rounded-full bg-black/30 px-2 py-0.5 text-xs font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </main>
  );
}

export default Dashboard;
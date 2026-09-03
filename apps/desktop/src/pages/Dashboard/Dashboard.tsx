import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Rocket,
  Clock,
  PieChart,
  TrendingUp,
  Kanban,
  FileText,
  Bot,
  Wand2,
  ArrowRight,
  Upload,
  FileCode,
  Search,
  Plus,
  CheckCircle2,
  Terminal,
  Zap,
  History,
} from "lucide-react";
import { jobsService, ApplicationStats } from "../../features/jobs/services/jobs.service";
import { useResumeStore } from "../../features/resume/stores/resume.store";

export default function Dashboard() {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const { file } = useResumeStore();
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
  const avgMatch = stats?.avg_match_score ? Number(stats.avg_match_score).toFixed(1) : "84.6";

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ========================================================================= */}
      {/* TOP KPI METRIC ROW (4 Minimalist Cards)                                   */}
      {/* ========================================================================= */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Card 1: Total Applications */}
        <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 transition-colors group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total Applications</span>
            <FolderOpen size={16} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">{totalApps}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <TrendingUp size={12} />
              +4 this week
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Active Pipeline</span>
            <span className="text-zinc-300">38 in flight</span>
          </div>
        </div>

        {/* Card 2: Applied This Week */}
        <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 transition-colors group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Applied This Week</span>
            <Rocket size={16} className="text-zinc-500 group-hover:text-sky-400 transition-colors" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">{appliedThisWeek}</span>
            <span className="text-[11px] font-mono text-zinc-400">Target: 10/wk</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, (appliedThisWeek / 10) * 100)}%` }} />
            </div>
            <span className="text-[11px] font-mono text-zinc-300">
              {Math.round((appliedThisWeek / 10) * 100)}%
            </span>
          </div>
        </div>

        {/* Card 3: In Active Interview */}
        <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 transition-colors group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">In Active Interview</span>
            <Clock size={16} className="text-amber-400 group-hover:animate-pulse" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-zinc-100">{inInterview}</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[11px] font-mono border border-amber-400/20">
              Next: Tomorrow
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span className="truncate max-w-[130px]">Stripe Round 3 (Arch)</span>
            <span className="text-zinc-300">2:30 PM IST</span>
          </div>
        </div>

        {/* Card 4: Average Skill Match */}
        <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 transition-colors group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Average Skill Match</span>
            <PieChart size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400">{avgMatch}%</span>
            <span className="text-[11px] font-mono text-zinc-400">High Signal</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Top Competency</span>
            <span className="text-emerald-400 truncate max-w-[130px]">Distributed Systems</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4-COLUMN BENTO GRID: Preparation & Execution Workbenches                  */}
      {/* ========================================================================= */}
      <section aria-labelledby="workbench-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 id="workbench-heading" className="text-sm font-semibold text-zinc-100">
              Preparation & Execution Workbenches
            </h2>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-[10px] font-mono border border-white/[0.08]">
              4 MODULES
            </span>
          </div>
          <span className="text-xs text-zinc-500">Integrated LLM-Assisted Toolchain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {/* Module 1: Pipeline Board */}
          <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 flex flex-col justify-between transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                  <Kanban size={16} />
                </div>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono border border-sky-500/20">
                  5 Stages
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">Pipeline Board</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Deterministic stage manager tracking applications across Screener, Technical, System Design, and Offer phases.
              </p>

              {/* Mini Pipeline Telemetry Graphic */}
              <div className="mt-4 p-2 bg-[#09090b] rounded-lg border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Applied</span>
                  <span>Offer</span>
                </div>
                <div className="grid grid-cols-5 gap-1 h-1.5">
                  <div className="bg-sky-400 rounded-sm" />
                  <div className="bg-sky-400/70 rounded-sm" />
                  <div className="bg-amber-400 rounded-sm" />
                  <div className="bg-amber-400/60 rounded-sm" />
                  <div className="bg-emerald-400 rounded-sm" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>18 Bookmarked</span>
                  <span>2 In Negotiation</span>
                </div>
              </div>
            </div>

            <Link
              to="/applications"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 group-hover:translate-x-0.5 transition-all"
            >
              <span>Open Kanban</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Module 2: Cover Letter Studio */}
          <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 flex flex-col justify-between transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                  <FileText size={16} />
                </div>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 text-[10px] font-mono border border-white/[0.08]">
                  ATS Mode
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">Cover Letter Studio</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Role-tailored generative compiler using your verified engineering accomplishments to match target spec requirements.
              </p>

              {/* Micro Preview */}
              <div className="mt-4 p-2 bg-[#09090b] rounded-lg border border-white/[0.06] font-mono text-[11px] text-zinc-400 space-y-1">
                <div className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Role: Staff Backend Engineer</span>
                </div>
                <div className="text-zinc-500 truncate text-[10px]">
                  "Re-architected ingest cluster to 120k RPS..."
                </div>
              </div>
            </div>

            <Link
              to="/cover-letter"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 group-hover:translate-x-0.5 transition-all"
            >
              <span>Launch Studio</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Module 3: STAR Interview Simulator */}
          <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 flex flex-col justify-between transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                  <Bot size={16} />
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-mono border border-amber-400/20">
                  Drill: 2m
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">STAR Interview Simulator</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Timed behavioral & distributed architecture drills with automated rubric evaluation and speech cadence checks.
              </p>

              {/* Micro Drill Indicator */}
              <div className="mt-4 p-2 bg-[#09090b] rounded-lg border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px] font-mono text-zinc-200">Concurrency Deadlock</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">120s</span>
              </div>
            </div>

            <Link
              to="/interview-prep"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 group-hover:translate-x-0.5 transition-all"
            >
              <span>Start 2m Drill</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Module 4: Google XYZ Bullet Rewriter */}
          <div className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 flex flex-col justify-between transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                  <Wand2 size={16} />
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 text-[10px] font-mono border border-emerald-400/20">
                  XYZ Formula
                </span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">Google XYZ Bullet Rewriter</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Transforms passive responsibility bullets into metric-anchored impact statements: 'Accomplished [X] by doing [Y] as measured by [Z]'.
              </p>

              {/* Formula Mini Badge */}
              <div className="mt-4 p-2 bg-[#09090b] rounded-lg border border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-zinc-500">Input:</span>
                <span className="text-rose-400 line-through truncate max-w-[70px]">Maintained DB</span>
                <span className="text-zinc-500">→</span>
                <span className="text-emerald-400 truncate font-semibold">Reduced P99 by 38%</span>
              </div>
            </div>

            <Link
              to="/resume"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 group-hover:translate-x-0.5 transition-all"
            >
              <span>Optimize Resume</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM SPLIT SECTION (8:4 Layout)                                         */}
      {/* ========================================================================= */}
      <section aria-labelledby="split-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT (8 cols): Active Resume Competency Profile */}
        <div className="lg:col-span-8 bg-[#0f0f12] border border-white/[0.08] rounded-xl p-5 space-y-5">
          {/* Header of Left Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.06] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="split-heading" className="text-sm font-semibold text-zinc-100">
                  Active Resume Competency Profile
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] font-mono">
                  98% Parse Confidence
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Extracted from <code className="text-zinc-300 font-mono text-[11px]">{file?.name || "resume_v4_staff_infra.pdf"}</code> • Last verified: Today 08:45 UTC
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/resume"
                className="h-7 px-2.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Upload size={12} />
                <span>Re-parse PDF</span>
              </Link>
              <button
                type="button"
                onClick={() => alert("Model exported to clipboard")}
                className="h-7 px-2 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Export JSON Model"
              >
                <FileCode size={13} />
              </button>
            </div>
          </div>

          {/* Technical Skill Chips & Metrics */}
          <div className="space-y-4">
            {/* Category 1: Languages & Core Execution */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Languages & Core Execution
                </span>
                <span className="text-[10px] font-mono text-zinc-500">4 Identified</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {/* Python */}
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.14] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Python</span>
                    <span className="text-xs font-mono font-medium text-emerald-400">99%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "99%" }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>6 yrs exp</span>
                    <span>Verified</span>
                  </div>
                </div>

                {/* Go */}
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.14] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Go (Golang)</span>
                    <span className="text-xs font-mono font-medium text-emerald-400">94%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "94%" }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>4 yrs exp</span>
                    <span>Verified</span>
                  </div>
                </div>

                {/* TypeScript */}
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.14] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">TypeScript</span>
                    <span className="text-xs font-mono font-medium text-emerald-400">91%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "91%" }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>5 yrs exp</span>
                    <span>Verified</span>
                  </div>
                </div>

                {/* PostgreSQL */}
                <div className="bg-[#09090b] p-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.14] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">PostgreSQL</span>
                    <span className="text-xs font-mono font-medium text-emerald-400">96%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "96%" }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>5 yrs exp</span>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category 2: Distributed Systems & Infrastructure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Distributed Systems & Infrastructure
                </span>
                <span className="text-[10px] font-mono text-zinc-500">10 Identified</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "FastAPI", score: "95%", note: "Async/Pydantic", status: "emerald" },
                  { name: "Next.js 15", score: "88%", note: "App Router", status: "emerald" },
                  { name: "React", score: "92%", note: "Server Components", status: "emerald" },
                  { name: "Docker", score: "94%", note: "Multi-stage", status: "emerald" },
                  { name: "Kubernetes", score: "82%", note: "Helm/Cgroups", status: "amber" },
                  { name: "Redis", score: "91%", note: "Pub/Sub Cache", status: "emerald" },
                  { name: "Apache Kafka", score: "84%", note: "Event Streaming", status: "amber" },
                  { name: "GraphQL", score: "89%", note: "Schema Stitching", status: "emerald" },
                  { name: "PyTorch", score: "78%", note: "Inference", status: "amber" },
                  { name: "LangChain", score: "87%", note: "RAG Pipelines", status: "emerald" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#09090b] border border-white/[0.06] text-xs"
                  >
                    <span className="text-zinc-200 font-medium">{item.name}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className={`font-mono text-[11px] ${item.status === "emerald" ? "text-emerald-400" : "text-amber-400"}`}>
                      {item.score}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Telemetry Audit */}
            <div className="p-2.5 rounded-lg bg-[#09090b] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono gap-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Vector embedding hash: <code className="text-zinc-300">sha256:7f4a90b8</code></span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <span>Token Density: 4,820 tokens</span>
                <Link to="/resume" className="text-emerald-400 hover:underline">
                  View Raw Extraction
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (4 cols): Quick Action & Command Bar */}
        <div className="lg:col-span-4 bg-[#0f0f12] border border-white/[0.08] rounded-xl p-5 space-y-4">
          {/* Header */}
          <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-zinc-300" />
              <h2 className="text-sm font-semibold text-zinc-100">Quick Action & Command Bar</h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">ENGINE v1</span>
          </div>

          {/* Interactive Keyboard Shortcut Guide */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Keyboard Workflows</span>
            <div className="p-2 rounded-lg bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between cursor-pointer transition-colors group">
              <div className="flex items-center gap-2">
                <Search size={14} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-zinc-200">Global Search & Nav</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-white/[0.08] text-zinc-400 text-[10px] font-mono">
                ⌘K
              </kbd>
            </div>
            <Link
              to="/applications"
              className="p-2 rounded-lg bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Plus size={14} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-zinc-200">New Job Application</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-white/[0.08] text-zinc-400 text-[10px] font-mono">
                ⌘N
              </kbd>
            </Link>
            <Link
              to="/resume"
              className="p-2 rounded-lg bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-zinc-200">Run ATS Check</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-white/[0.08] text-zinc-400 text-[10px] font-mono">
                ⌘R
              </kbd>
            </Link>
          </div>

          {/* Direct Trigger Engine */}
          <div className="p-3.5 rounded-lg bg-[#09090b] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-100">Job Discovery Radar</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Continuous local worker scanning engineering boards matching your active profile.
            </p>
            <Link
              to="/jobs"
              className="w-full h-8 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap size={13} className="text-emerald-400" />
              <span>Trigger Discovery Scan</span>
            </Link>
          </div>

          {/* Recent Search History */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Recent Query Logs</span>
              <span className="text-emerald-400 hover:underline cursor-pointer">Clear</span>
            </div>
            <div className="space-y-1">
              {[
                { query: "Backend Engineer Mumbai ₹30L+", matches: "14 matches" },
                { query: "Staff Infra Kubernetes Remote", matches: "29 matches" },
                { query: "Distributed Systems Architect", matches: "8 matches" },
              ].map((log) => (
                <div
                  key={log.query}
                  onClick={() => navigate(`/jobs?q=${encodeURIComponent(log.query)}`)}
                  className="p-2 rounded-lg bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <History size={12} className="text-zinc-500 shrink-0" />
                    <span className="text-[11px] font-mono text-zinc-300 truncate">{log.query}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0 ml-2">{log.matches}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
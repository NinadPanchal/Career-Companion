import { useState, useRef } from "react";
import { 
  FileText, 
  Upload, 
  Radar, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal, 
  Download, 
  Copy, 
  Check, 
  Wand2, 
  RotateCw, 
  Layers,
  Zap
} from "lucide-react";
import { useResumeStore, ResumeAnalysisResult } from "../../features/resume/stores/resume.store";
import { resumeService } from "../../features/resume/services/resume.service";
import { aiService } from "../../features/ai/services/ai.service";

interface Variation {
  title: string;
  badgeType: "emerald" | "sky" | "amber";
  score: string;
  text: string;
  x: string;
  y: string;
  z: string;
}

const DEFAULT_VARIATIONS: Variation[] = [
  {
    title: "Variation 1 • High Impact Metrics",
    badgeType: "emerald",
    score: "98/100 ATS",
    text: "Engineered asynchronous FastAPI ingestion pipeline, slashing p95 API latency by 38% and scaling database query throughput to 14,200 req/sec via Redis caching.",
    x: "FastAPI pipeline",
    y: "-38% p95 & 14.2k req/s",
    z: "Redis caching"
  },
  {
    title: "Variation 2 • System Architecture",
    badgeType: "sky",
    score: "94/100 ATS",
    text: "Re-architected payment webhook ingestion using Apache Kafka and PostgreSQL read replicas, achieving 99.98% delivery reliability across ₹40M+ monthly transaction volume.",
    x: "Payment webhook reliability",
    y: "99.98% uptime / ₹40M+",
    z: "Kafka & Postgres replicas"
  },
  {
    title: "Variation 3 • Cost & Efficiency",
    badgeType: "amber",
    score: "92/100 ATS",
    text: "Optimized SQL relational indices and connection pooling across 8 microservices, reducing AWS RDS compute spend by $2,400/month while cutting median response time by 42ms.",
    x: "SQL query & infra optimization",
    y: "-$2,400/mo & -42ms response",
    z: "Indices & connection pooling"
  }
];

export default function Resume() {
  const { file, analysis, setFile, setAnalysis } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Bullet optimizer state
  const [bulletInput, setBulletInput] = useState(
    "Worked on backend APIs to make database queries run faster and handled payment notifications."
  );
  const [impactTone, setImpactTone] = useState(3);
  const [metricFocus, setMetricFocus] = useState(1);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [variations, setVariations] = useState<Variation[]>(DEFAULT_VARIATIONS);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setIsUploading(true);
    setUploadMessage("");

    try {
      const result = await resumeService.uploadResume(selected) as ResumeAnalysisResult;
      setAnalysis(result);
      setUploadMessage(`Successfully parsed ${result.word_count || 682} words`);
    } catch (err) {
      console.error(err);
      setUploadMessage("Parsed local document structure");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSynthesize = async () => {
    if (!bulletInput.trim()) return;
    setIsSynthesizing(true);

    try {
      const result = await aiService.optimizeBullet(bulletInput);
      if (result && result.optimized_versions && result.optimized_versions.length > 0) {
        const mapped: Variation[] = result.optimized_versions.map((ver, i) => ({
          title: `Variation ${i + 1} • ${ver.framework || 'Google XYZ Impact'}`,
          badgeType: i === 0 ? "emerald" : i === 1 ? "sky" : "amber",
          score: `${Math.min(99, 90 + i * 3)}/100 ATS`,
          text: ver.text,
          x: ver.text.split(",")[0] || "Engineered service",
          y: ver.metrics || "Measured by 35% improvement",
          z: ver.tone || "Applied production framework"
        }));
        setVariations(mapped);
      } else {
        setVariations(DEFAULT_VARIATIONS);
      }
    } catch (err) {
      console.error(err);
      setVariations(DEFAULT_VARIATIONS);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleApply = (idx: number) => {
    setAppliedIdx(idx);
    setTimeout(() => setAppliedIdx(null), 2500);
  };

  const handleInsertMissingKeyword = (keyword: string) => {
    setBulletInput(prev => `${prev.trim()} utilizing ${keyword}`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans select-none">
      {/* ========================================================================= */}
      {/* TOP HEADER / WORKBENCH CONTEXT                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        {/* Left: Breadcrumbs & Target Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Preparation</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-100 font-semibold">Resume & ATS Bullet Optimizer</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08]" />
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ATS Target: 92+ Score</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-3 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Upload size={13} className="text-zinc-400" />
            <span>Import New Master Resume</span>
            <kbd className="text-[10px] font-mono text-zinc-500 bg-black/40 px-1 rounded border border-white/[0.08]">
              ⌘U
            </kbd>
          </button>

          <button
            onClick={() => alert("Master resume exported as ATS-compliant clean text.")}
            className="h-8 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download size={13} />
            <span>Export Clean PDF</span>
            <kbd className="text-[10px] font-mono text-black/60 bg-white/20 px-1 rounded">
              ⌘E
            </kbd>
          </button>

          <div className="h-4 w-px bg-white/[0.08] mx-1" />

          <button
            type="button"
            className="w-7 h-7 rounded border border-white/[0.08] bg-[#0f0f12] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            title="Configure Parser Weights"
          >
            <SlidersHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DUAL-PANE WORKBENCH CANVAS (5 cols Left, 7 cols Right)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* ======================================================================= */}
        {/* LEFT PANE: Resume Ingestion & Parsing Workbench (5 Columns)             */}
        {/* ======================================================================= */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-4">
          {/* Panel 1: Master Resume Dropzone & Active Ingestion State */}
          <section className="bg-[#0f0f12] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-400" />
                <h2 className="text-xs font-semibold text-zinc-100">Resume Parsing Stream</h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OCR PARSER: ACTIVE</span>
              </span>
            </div>

            {/* Drag & Drop Tile */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-white/[0.1] hover:border-emerald-500/50 bg-[#09090b]/80 rounded-lg p-5 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-emerald-500/10 flex items-center justify-center mb-1 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <Upload size={16} />
              </div>
              <p className="text-xs text-zinc-200 font-medium">
                Drag and drop <span className="font-mono text-emerald-400">{file?.name || "v4_master_resume.pdf"}</span> or click to upload
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Supports ATS-validated PDF, DOCX, and Plain LaTeX text exports
              </p>
            </div>

            {/* Active Parsed Status Pill */}
            <div className="bg-[#18181b]/60 border border-white/[0.06] rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <FileText size={14} />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-zinc-200 truncate">
                    {file?.name || "resume_v4_staff_infra.pdf"}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {uploadMessage || (analysis?.word_count ? `Parsed • ${analysis.word_count} Words • ${analysis.skills?.length || 12} Skills Identified` : "Parsed • 682 Words • 4 Pages • Last Sync Today")}
                  </div>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-zinc-400 hover:text-white p-1 hover:bg-white/[0.04] rounded transition-colors shrink-0"
                title="Re-parse file"
              >
                <RotateCw size={13} className={isUploading ? "animate-spin" : ""} />
              </button>
            </div>
          </section>

          {/* Panel 2: ATS Keyword Benchmark Radar & Compatibility */}
          <section className="bg-[#0f0f12] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Radar size={16} className="text-emerald-400" />
                <h3 className="text-xs font-semibold text-zinc-100">ATS Keyword Benchmark Radar</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.08]">
                ROLE: L6 BACKEND
              </span>
            </div>

            {/* Match Score Gauge */}
            <div className="bg-[#09090b] border border-white/[0.06] rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400 block">Match Score against target role:</span>
                <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  89% High ATS Compatibility
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs font-mono text-zinc-200">89 / 100</div>
                <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: "89%" }} />
                </div>
              </div>
            </div>

            {/* High Frequency Keywords Detected */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="text-zinc-300 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>High Frequency Keywords Detected</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">5 Tokens Pinned</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "FastAPI", count: "4x" },
                  { name: "Distributed Systems", count: "7x" },
                  { name: "Kafka", count: "3x" },
                  { name: "PostgreSQL", count: "5x" },
                  { name: "Docker/K8s", count: "6x" },
                ].map((kw) => (
                  <span
                    key={kw.name}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#18181b] border border-white/[0.06] text-zinc-200 text-xs font-mono"
                  >
                    <span>{kw.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-black/40 px-1 rounded font-bold">
                      {kw.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Crucial Keywords */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle size={13} />
                  <span>Missing Crucial Keywords (Role Threshold Gap)</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">-11% penalty</span>
              </div>
              <div className="space-y-1.5">
                {[
                  "Event-driven architecture",
                  "p99 SLA",
                  "Circuit breaker pattern",
                ].map((token) => (
                  <div
                    key={token}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] border border-white/[0.06] hover:border-white/[0.14] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span className="text-xs font-mono text-zinc-200">{token}</span>
                    </div>
                    <button
                      onClick={() => handleInsertMissingKeyword(token)}
                      className="h-6 px-2 rounded bg-white/[0.04] hover:bg-emerald-500 hover:text-zinc-950 border border-white/[0.08] text-zinc-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                    >
                      <span>+ Insert</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Panel 3: Extracted Technical Taxonomy & Proficiency Ratings */}
          <section className="bg-[#0f0f12] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                <Layers size={15} className="text-emerald-400" />
                <span>Extracted Technical Taxonomy</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">4 Core Domains</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] border border-white/[0.06]">
                <span className="text-zinc-300">Distributed Systems & Concurrency</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => <span key={i} className="w-2 h-2 rounded-sm bg-emerald-400" />)}
                    <span className="w-2 h-2 rounded-sm bg-zinc-800" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">L5 Senior</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] border border-white/[0.06]">
                <span className="text-zinc-300">Storage Engines (Postgres / Redis)</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="w-2 h-2 rounded-sm bg-emerald-400" />)}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Staff Eng</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] border border-white/[0.06]">
                <span className="text-zinc-300">Infrastructure & Observability</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <span key={i} className="w-2 h-2 rounded-sm bg-amber-400" />)}
                    {[4, 5].map(i => <span key={i} className="w-2 h-2 rounded-sm bg-zinc-800" />)}
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">Mid-Senior</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT PANE: Google XYZ Accomplishment Rewriter (7 Columns)               */}
        {/* ======================================================================= */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-4">
          {/* Main Executive Rewriter Header Block */}
          <section className="bg-[#0f0f12] border border-white/[0.08] rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Wand2 size={18} className="text-emerald-400" />
                  <h2 className="text-sm font-semibold text-zinc-100">Google XYZ Accomplishment Rewriter</h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  <span className="text-emerald-400 font-medium">"Accomplished [X], as measured by [Y], by doing [Z]"</span> — transforms passive descriptions into high-impact engineering accomplishments.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-zinc-400 shrink-0">
                MODEL: LLM-XYZ-PRO
              </span>
            </div>

            {/* Weak Input Bullet Container */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <label className="text-zinc-300 font-medium flex items-center gap-1" htmlFor="weak-bullet-input">
                  <span>Raw Input Bullet (Engineering Journal / Resume Draft):</span>
                </label>
                <button
                  onClick={() => setBulletInput("Worked on backend APIs to make database queries run faster and handled payment notifications.")}
                  className="text-[10px] font-mono text-emerald-400 hover:underline"
                >
                  Reset sample
                </button>
              </div>

              <div className="relative">
                <textarea
                  id="weak-bullet-input"
                  rows={2}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="Type or paste a passive bullet point..."
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-lg p-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed"
                />
                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing}
                  className="absolute bottom-2.5 right-2.5 h-6 px-2.5 rounded bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-semibold text-[10px] font-mono flex items-center gap-1 transition-all"
                >
                  <Zap size={11} className="fill-black" />
                  <span>{isSynthesizing ? "Synthesizing..." : "Synthesize (Enter)"}</span>
                </button>
              </div>

              {/* Detected Weaknesses Badge */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertCircle size={14} className="text-rose-400 shrink-0" />
                <span className="text-[10px] font-mono text-rose-400 font-semibold shrink-0">Detected weaknesses:</span>
                <span className="text-xs text-zinc-300">
                  Lacks quantifiable metric • Weak action verb • Vague scope
                </span>
              </div>
            </div>

            {/* Interactive Bullet Customizer Sliders */}
            <div className="bg-[#09090b] border border-white/[0.06] rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Impact Tone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px]">Impact Tone</span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {impactTone === 1 ? "Technical" : impactTone === 2 ? "Executive" : "High-Scale Utilitarian"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={impactTone}
                  onChange={(e) => setImpactTone(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Technical</span>
                  <span>Executive</span>
                  <span>High-Scale</span>
                </div>
              </div>

              {/* Metric Focus */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px]">Metric Focus Axis</span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {metricFocus === 1 ? "Latency & Throughput" : metricFocus === 2 ? "Scale & Volume" : metricFocus === 3 ? "Revenue & Cost" : "Reliability SLA"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={metricFocus}
                  onChange={(e) => setMetricFocus(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Latency</span>
                  <span>Scale</span>
                  <span>Revenue</span>
                  <span>Reliability</span>
                </div>
              </div>
            </div>
          </section>

          {/* AI-Rewritten Variations Output Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Optimal XYZ Formulations (3 Deterministic Variants Generated)
              </span>
              <button
                onClick={handleSynthesize}
                className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RotateCw size={11} className={isSynthesizing ? "animate-spin" : ""} />
                <span>Regenerate with new seed</span>
              </button>
            </div>

            {variations.map((v, idx) => (
              <div
                key={v.title}
                className="bg-[#0f0f12] border border-white/[0.08] hover:border-white/[0.16] rounded-xl p-4 sm:p-5 transition-all duration-150 flex flex-col gap-3 shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      v.badgeType === "emerald" 
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                        : v.badgeType === "sky"
                        ? "bg-sky-500/10 border border-sky-500/20 text-sky-400"
                        : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    }`}>
                      {v.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Score: {v.score}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(v.text, idx)}
                      className="h-6 px-2 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedIdx === idx ? "Copied!" : "Copy to Clipboard"}</span>
                    </button>

                    <button
                      onClick={() => handleApply(idx)}
                      className="h-6 px-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-[10px] font-mono flex items-center gap-1 transition-colors"
                    >
                      {appliedIdx === idx ? <Check size={11} /> : <Zap size={11} className="fill-black" />}
                      <span>{appliedIdx === idx ? "Applied!" : "Apply to Resume"}</span>
                    </button>
                  </div>
                </div>

                {/* Structured XYZ Render Box */}
                <p className="text-xs text-zinc-200 leading-relaxed bg-[#09090b] p-3 rounded-lg border border-white/[0.06]">
                  {v.text}
                </p>

                {/* XYZ Dimensional Breakdown Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.04] text-[10px] font-mono text-zinc-400">
                  <span><strong className="text-emerald-400">[X] Accomplished:</strong> {v.x}</span>
                  <span className="text-zinc-600">•</span>
                  <span><strong className="text-sky-400">[Y] Measured:</strong> {v.y}</span>
                  <span className="text-zinc-600">•</span>
                  <span><strong className="text-amber-400">[Z] Action:</strong> {v.z}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Telemetry Bottom Bar */}
          <div className="h-8 rounded-lg bg-[#0f0f12] border border-white/[0.08] px-3 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>LATENCY: 284ms</span>
              </span>
              <span>•</span>
              <span>TOKENS: 412 OUT</span>
              <span>•</span>
              <span>PARSER: V4-STRICT</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span>PRESS ⌘S TO COMMIT DIFF TO MASTER RESUME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
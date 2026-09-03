import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  FileCheck, 
  Wand2, 
  Award, 
  Copy, 
  Check, 
  Zap, 
  Tag, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";
import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import ResumeUpload from "../../features/resume/components/ResumeUploader";
import { useResumeStore } from "../../features/resume/stores/resume.store";
import { aiService, BulletOptimizeResult } from "../../features/ai/services/ai.service";

export default function Resume() {
  const { analysis } = useResumeStore();
  const [activeTab, setActiveTab] = useState<"upload" | "optimizer" | "scorecard">("upload");

  // Bullet optimizer state
  const [bulletInput, setBulletInput] = useState("Worked on backend services and made API faster for users");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<BulletOptimizeResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleOptimizeBullet = async () => {
    if (!bulletInput.trim()) return;
    setIsOptimizing(true);
    try {
      const data = await aiService.optimizeBullet(bulletInput);
      setOptimizedResult(data);
    } catch (err) {
      console.error("Failed to optimize bullet", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles size={14} /> Resume Intelligence Suite
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Resume Manager & ATS Engine</h1>
          <p className="mt-1 text-zinc-400">
            Parse resume PDFs, analyze ATS keyword compliance, and rewrite bullet points into high-impact accomplishment statements.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
          <button
            onClick={() => setActiveTab("upload")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "upload" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Upload & Parser
          </button>
          <button
            onClick={() => setActiveTab("optimizer")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "optimizer" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Wand2 size={13} className="text-amber-400" /> Bullet Optimizer
          </button>
          <button
            onClick={() => setActiveTab("scorecard")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === "scorecard" ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Award size={13} className="text-emerald-400" /> ATS Scorecard
          </button>
        </div>
      </div>

      {activeTab === "upload" && (
        <Card className="border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <FileCheck className="text-emerald-400" size={24} />
            <div>
              <h2 className="text-xl font-bold">Upload & Parse Document</h2>
              <p className="text-xs text-zinc-400">Supports PDF and Word (.docx) formats up to 10MB</p>
            </div>
          </div>

          <ResumeUpload />
        </Card>
      )}

      {activeTab === "optimizer" && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Input column */}
          <div className="space-y-6 lg:col-span-5">
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2">
                <Wand2 size={18} className="text-amber-400" />
                <h2 className="text-lg font-bold">Google XYZ Bullet Rewriter</h2>
              </div>
              <p className="mb-4 text-xs text-zinc-400">
                Transforms ordinary task descriptions into recruiter-pleasing accomplishment formulas: 
                <strong className="text-zinc-200 block mt-1">"Accomplished [X] as measured by [Y], by doing [Z]"</strong>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                    Paste Resume Bullet Point
                  </label>
                  <textarea
                    rows={4}
                    value={bulletInput}
                    onChange={(e) => setBulletInput(e.target.value)}
                    placeholder="e.g. Built frontend components with React and improved performance"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <Button
                  onClick={handleOptimizeBullet}
                  disabled={isOptimizing || !bulletInput.trim()}
                  className="w-full justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/20"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Rewriting with AI...
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Generate 3 High-Impact Variations
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                Why Power Verbs Matter
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recruiters spend an average of 6 seconds reviewing a resume. Leading every bullet with decisive action verbs like <strong className="text-zinc-200">Engineered, Architected, Spearheaded, Accelerated</strong> instantly signals high ownership and engineering maturity.
              </p>
            </Card>
          </div>

          {/* Output column */}
          <div className="space-y-4 lg:col-span-7">
            {optimizedResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-300">Optimized Variations (Ready to Copy)</h3>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
                    Impact Score: {optimizedResult.impact_score}/100
                  </span>
                </div>

                {optimizedResult.optimized_versions.map((ver, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-zinc-800 bg-zinc-900/80 p-5 transition hover:border-zinc-700">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/20">
                          {ver.framework}
                        </span>
                        <Button
                          variant="secondary"
                          onClick={() => handleCopy(ver.text, idx)}
                          className="flex items-center gap-1.5 text-xs py-1 px-2.5"
                        >
                          {copiedIdx === idx ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          {copiedIdx === idx ? "Copied!" : "Copy Bullet"}
                        </Button>
                      </div>

                      <p className="font-mono text-sm leading-relaxed text-zinc-100 selection:bg-amber-500/30">
                        • {ver.text}
                      </p>

                      <div className="mt-3 flex items-center gap-3 border-t border-zinc-800/60 pt-2 text-[11px] text-zinc-400">
                        <span><strong>Key Metric:</strong> {ver.metrics}</span>
                        <span>•</span>
                        <span><strong>Tone:</strong> {ver.tone}</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="flex h-72 flex-col items-center justify-center p-8 text-center text-zinc-500">
                <Wand2 size={36} className="mb-2 text-zinc-700" />
                <p className="text-sm font-semibold text-zinc-400">Paste any bullet on the left to see 3 high-impact rewrites</p>
                <p className="text-xs text-zinc-600">Includes quantifiable metrics and strong action verbs</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === "scorecard" && (
        <div className="space-y-6">
          {/* Overall ATS Banner */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Overall ATS Score</p>
              <div className="mt-2 text-4xl font-black text-white">92<span className="text-lg text-emerald-400">/100</span></div>
              <p className="mt-2 text-xs text-zinc-400">Top 8% percentile of applicant profiles</p>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Action Verb Density</p>
              <div className="mt-2 text-4xl font-black text-white">95%</div>
              <p className="mt-2 text-xs text-zinc-500">Every bullet starts with a decisive verb</p>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quantifiable Results</p>
              <div className="mt-2 text-4xl font-black text-white">88%</div>
              <p className="mt-2 text-xs text-zinc-500">Numbers, percentages, scale mentioned</p>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Format & Parsability</p>
              <div className="mt-2 text-4xl font-black text-white">98%</div>
              <p className="mt-2 text-xs text-zinc-500">Clean single-column standard format</p>
            </Card>
          </div>

          {/* Detailed Skill Checklist */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-base font-bold text-white flex items-center gap-2">
              <Tag size={18} className="text-emerald-400" /> Extracted Skills & Industry Match
            </h3>

            {analysis?.skills?.length ? (
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400" /> {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Upload your resume in the Parser tab to view your parsed skill profile and ATS compliance metrics.
              </p>
            )}
          </Card>
        </div>
      )}
    </main>
  );
}
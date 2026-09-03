import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  FileText, 
  Share2, 
  Mail, 
  Tag, 
  SlidersHorizontal 
} from "lucide-react";
import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import { aiService, CoverLetterResult } from "../../features/ai/services/ai.service";
import { useResumeStore } from "../../features/resume/stores/resume.store";

export default function CoverLetter() {
  const { analysis } = useResumeStore();

  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [companyName, setCompanyName] = useState("Razorpay");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Senior Full Stack Engineer to lead payments core architecture. Experience with React, TypeScript, high-throughput microservices, and distributed systems required."
  );
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "direct" | "technical">("professional");
  const [formatType, setFormatType] = useState<"cover_letter" | "linkedin_outreach" | "cold_email">("cover_letter");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateCoverLetter({
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
        candidate_skills: analysis?.skills || ["React", "TypeScript", "Python", "System Design"],
        tone,
        format_type: formatType
      });
      setResult(data);
    } catch (err) {
      console.error("Failed to generate cover letter", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.content) return;
    const blob = new Blob([result.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, "_")}_${formatType}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles size={14} /> AI Outreach Suite
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Cover Letter & Outreach</h1>
        <p className="mt-1 text-zinc-400">
          Generate tailored cover letters, LinkedIn referral messages, and cold pitch emails matching your resume to any job description.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Configuration Form */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-emerald-400" /> Target Role Configuration
            </h2>

            {/* Format Type Selector */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold text-zinc-300">Outreach Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormatType("cover_letter")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                    formatType === "cover_letter"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <FileText size={18} className="mb-1 text-emerald-400" />
                  <span className="text-xs font-semibold">Cover Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatType("linkedin_outreach")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                    formatType === "linkedin_outreach"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Share2 size={18} className="mb-1 text-blue-400" />
                  <span className="text-xs font-semibold">LinkedIn Pitch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatType("cold_email")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                    formatType === "cold_email"
                      ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Mail size={18} className="mb-1 text-emerald-400" />
                  <span className="text-xs font-semibold">Cold Email</span>
                </button>
              </div>
            </div>

            {/* Role & Company Inputs */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">Target Role Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead Platform Engineer"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe / Flipkart"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tone selection */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">Voice & Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "enthusiastic", "technical", "direct"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition ${
                        tone === t
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job description paste */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Job Description / Requirements (Optional)
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste JD requirements to extract ATS matching keywords automatically..."
                  className="w-full rounded-lg border border-white/[0.08] bg-[#09090b] p-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !jobTitle.trim() || !companyName.trim()}
                className="w-full justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-none"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Crafting Pitch...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Tailored Outreach
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Output & Export */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="flex h-full min-h-[550px] flex-col border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Generated Pitch Document</h3>
                <p className="text-xs text-zinc-400">
                  {result?.estimated_read_time_secs ? `~${result.estimated_read_time_secs} sec read time` : "Ready to generate"}
                </p>
              </div>

              {result && (
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handleCopy} className="flex items-center gap-1.5 text-xs py-1.5">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Text"}
                  </Button>
                  <Button variant="secondary" onClick={handleDownload} className="flex items-center gap-1.5 text-xs py-1.5">
                    <Download size={14} /> Download .md
                  </Button>
                </div>
              )}
            </div>

            {/* Output Box */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-3 text-center">
                  <div className="rounded-xl bg-emerald-500/10 p-4 text-emerald-400 animate-pulse">
                    <Sparkles size={32} />
                  </div>
                  <p className="text-sm font-semibold text-white">Analyzing role requirements & matching resume skills...</p>
                  <p className="text-xs text-zinc-500">Formatting tone for high recruiter reply rate</p>
                </div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {result.subject_line && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
                      <span className="text-xs font-semibold text-zinc-500">Subject: </span>
                      <span className="text-xs font-bold text-emerald-300">{result.subject_line}</span>
                    </div>
                  )}

                  <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-5 font-mono text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap selection:bg-emerald-500/30">
                    {result.content}
                  </div>

                  {/* Matched Keywords */}
                  {result.target_keywords?.length > 0 && (
                    <div className="pt-2">
                      <p className="mb-2 text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Tag size={12} className="text-emerald-400" /> Target Keywords Included:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.target_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center p-8 text-zinc-500">
                  <FileText size={40} className="mb-3 text-zinc-700" />
                  <p className="text-sm font-medium text-zinc-400">Configure your target role on the left and click generate</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Personalized based on active resume skills and target company
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

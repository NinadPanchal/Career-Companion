import { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Share2, 
  Mail, 
  SlidersHorizontal 
} from "lucide-react";
import { Card, Button, Tabs } from "../../components/ui";
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
    <div className="space-y-6 animate-fade-in font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Outreach & Cover Letter Studio</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Role Tailored
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">Generate high-impact cover letters, referral pitches, and hiring manager cold emails.</p>
        </div>

        <Tabs
          size="sm"
          tabs={[
            { id: "cover_letter", label: "Cover Letter", icon: <FileText size={13} /> },
            { id: "linkedin_outreach", label: "LinkedIn Pitch", icon: <Share2 size={13} /> },
            { id: "cold_email", label: "Cold Email", icon: <Mail size={13} /> },
          ]}
          activeTab={formatType}
          onChange={(tab) => setFormatType(tab as "cover_letter" | "linkedin_outreach" | "cold_email")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <SlidersHorizontal size={15} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Target Position Spec</h2>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Target Role Title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead Platform Engineer"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Razorpay, Zepto, Stripe"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">Voice & Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "enthusiastic", "technical", "direct"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-all cursor-pointer ${
                        tone === t
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold"
                          : "border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.12]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-300">Target Job Requirements</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste snippet or role requirements..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#07080a] p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50 resize-none transition-colors"
                />
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                disabled={isLoading || !jobTitle.trim() || !companyName.trim()}
                className="w-full gap-2"
              >
                <Sparkles size={14} />
                <span>{isLoading ? "Generating Tailored Draft..." : "Generate Outreach"}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Document Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card ambient className="p-6 min-h-[500px] flex flex-col justify-between">
            <div>
              {/* Document Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    {formatType.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Export .md</span>
                  </button>
                </div>
              </div>

              {/* Subject Line if email */}
              {result?.subject_line && (
                <div className="my-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono">
                  <span className="text-zinc-500">Subject: </span>
                  <span className="text-emerald-400 font-semibold">{result.subject_line}</span>
                </div>
              )}

              {/* Document Text Body */}
              <div className="mt-4 text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
                {result?.content ? (
                  result.content
                ) : (
                  <div className="py-24 text-center text-zinc-500">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Configure position on the left and click "Generate Outreach"</p>
                    <p className="text-[11px] text-zinc-600 mt-1">Our generative model pairs your verified accomplishments with target requirements.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Telemetry Footer */}
            {result?.content && (
              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{result.content.split(/\s+/).length} Words</span>
                <span>Est. read time: ~{result.estimated_read_time_secs || 45}s</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

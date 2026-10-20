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
import { Card, Button, Tabs, Badge } from "../../components/ui";
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
    <div className="space-y-5 animate-fade-in font-sans select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#f4f4f5] tracking-tight">Outreach Studio</h1>
            <Badge variant="emerald" size="sm">Tailored draft</Badge>
          </div>
          <p className="text-xs text-[#71717a] mt-0.5">Generate tailored cover letters, referral pitches, and hiring manager cold emails.</p>
        </div>

        <Tabs
          size="sm"
          tabs={[
            { id: "cover_letter", label: "Cover letter", icon: <FileText size={13} /> },
            { id: "linkedin_outreach", label: "LinkedIn pitch", icon: <Share2 size={13} /> },
            { id: "cold_email", label: "Cold email", icon: <Mail size={13} /> },
          ]}
          activeTab={formatType}
          onChange={(tab) => setFormatType(tab as "cover_letter" | "linkedin_outreach" | "cold_email")}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Left Column: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.08]">
              <SlidersHorizontal size={14} className="text-[#10b981]" />
              <h2 className="text-xs font-semibold text-[#f4f4f5]">Role details</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-[#a1a1aa]">Target role title *</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead Platform Engineer"
                  className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-[#a1a1aa]">Company name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Razorpay, Zepto, Stripe"
                  className="w-full h-8 px-2.5 rounded-[8px] border border-white/[0.08] bg-[#09090b] text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] transition-colors"
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="mb-1.5 block text-xs text-[#a1a1aa]">Voice & tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "enthusiastic", "technical", "direct"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`rounded-[6px] border px-2.5 py-1.5 text-xs capitalize transition-colors cursor-pointer ${
                        tone === t
                          ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981] font-semibold"
                          : "border-white/[0.08] bg-[#18181b] text-[#71717a] hover:text-[#d4d4d8] hover:border-white/[0.16]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="mb-1 block text-xs text-[#a1a1aa]">Role requirements or description snippet</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste snippet or role requirements..."
                  className="w-full rounded-[8px] border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-[#f4f4f5] placeholder-[#71717a] outline-none focus:border-[#10b981] resize-none transition-colors"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerate}
                disabled={isLoading || !jobTitle.trim() || !companyName.trim()}
                className="w-full gap-2 mt-1"
              >
                <Sparkles size={13} />
                <span>{isLoading ? "Generating draft..." : "Generate draft"}</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Document Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 min-h-[480px] flex flex-col justify-between">
            <div>
              {/* Document Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span className="text-xs font-semibold text-[#f4f4f5] capitalize">
                    {formatType.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#d4d4d8] hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Copy draft"
                  >
                    {copied ? <Check size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#d4d4d8] hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Export Markdown file"
                  >
                    <Download size={12} />
                    <span>Export .md</span>
                  </button>
                </div>
              </div>

              {/* Subject Line if email */}
              {result?.subject_line && (
                <div className="my-3 p-2.5 rounded-[6px] bg-[#18181b] border border-white/[0.08] text-xs">
                  <span className="text-[#71717a]">Subject: </span>
                  <span className="text-[#10b981] font-medium">{result.subject_line}</span>
                </div>
              )}

              {/* Document Text Body */}
              <div className="mt-4 text-xs sm:text-sm text-[#d4d4d8] leading-relaxed font-sans whitespace-pre-wrap select-text">
                {result?.content ? (
                  result.content
                ) : (
                  <div className="py-20 text-center text-[#71717a]">
                    <FileText size={28} className="mx-auto mb-2 opacity-30 text-[#71717a]" />
                    <p className="text-xs text-[#a1a1aa] font-medium">No draft generated yet</p>
                    <p className="text-xs text-[#71717a] mt-1 max-w-sm mx-auto">
                      Fill in the target role and company details on the left, then click "Generate draft" to create a personalized pitch.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Telemetry Footer */}
            {result?.content && (
              <div className="mt-5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#71717a]">
                <span>{result.content.split(/\s+/).length} words</span>
                <span>Est. read time: ~{result.estimated_read_time_secs || 45}s</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

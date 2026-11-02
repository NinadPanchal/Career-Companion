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
import { Card, Button, Tabs, Badge, Input, Textarea, EmptyState } from "../../components/ui";
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
    <div className="flex flex-col gap-6 font-sans select-none pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--divider)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-[var(--text)] tracking-tight">
              Outreach Studio
            </h1>
            <Badge variant="emerald" size="sm">
              Tailored draft
            </Badge>
          </div>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1 leading-relaxed">
            Generate tailored cover letters, referral pitches, and hiring manager cold emails.
          </p>
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

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Configuration Form (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[var(--divider)]">
              <SlidersHorizontal size={14} className="text-[var(--accent)]" />
              <h2 className="text-[var(--text-xs)] font-semibold text-[var(--text)]">
                Role details
              </h2>
            </div>

            <div className="space-y-3">
              <Input
                label="Target role title *"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Lead Platform Engineer"
              />

              <Input
                label="Company name *"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Razorpay, Zepto, Stripe"
              />

              {/* Tone Selection */}
              <div>
                <label className="mb-1.5 block text-[var(--text-xs)] font-medium text-[var(--text-muted)]">
                  Voice & tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["professional", "enthusiastic", "technical", "direct"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`rounded-[var(--radius-md)] border px-2.5 py-1.5 text-[var(--text-xs)] capitalize transition-all cursor-pointer ${
                        tone === t
                          ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] font-semibold shadow-sm"
                          : "border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--glass-bg-strong)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <Textarea
                label="Role requirements or description snippet"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste snippet or role requirements..."
              />

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                disabled={isLoading || !jobTitle.trim() || !companyName.trim()}
                leftIcon={<Sparkles size={14} />}
                className="w-full mt-1"
              >
                {isLoading ? "Generating draft..." : "Generate draft"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Document Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="min-h-[480px] flex flex-col justify-between">
            <div>
              {/* Document Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--divider)]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="text-[var(--text-xs)] font-semibold text-[var(--text)] capitalize">
                    {formatType.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] hover:border-[var(--glass-highlight)] text-[var(--text-xs)] text-[var(--text)] transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Copy draft"
                  >
                    {copied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!result?.content}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] hover:border-[var(--glass-highlight)] text-[var(--text-xs)] text-[var(--text)] transition-all disabled:opacity-30 cursor-pointer"
                    aria-label="Export Markdown file"
                  >
                    <Download size={12} />
                    <span>Export .md</span>
                  </button>
                </div>
              </div>

              {/* Subject Line if email */}
              {result?.subject_line && (
                <div className="my-3 p-2.5 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-xs)]">
                  <span className="text-[var(--text-muted)]">Subject: </span>
                  <span className="text-[var(--accent)] font-medium">{result.subject_line}</span>
                </div>
              )}

              {/* Document Text Body */}
              <div className="mt-4 text-[var(--text-sm)] text-[var(--text)] leading-relaxed font-sans whitespace-pre-wrap select-text">
                {result?.content ? (
                  result.content
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="No draft generated yet"
                    description="Fill in the target role and company details on the left, then click 'Generate draft' to create a personalized pitch."
                    className="py-16 border-none bg-transparent shadow-none"
                  />
                )}
              </div>
            </div>

            {/* Document Telemetry Footer */}
            {result?.content && (
              <div className="mt-5 pt-2.5 border-t border-[var(--divider)] flex items-center justify-between text-[var(--text-xs)] text-[var(--text-muted)] font-mono">
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

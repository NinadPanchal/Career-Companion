import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  X,
  Briefcase,
  GraduationCap,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { Card, Button, Badge, Input, Textarea, ProgressRing } from "../../components/ui";
import { profileService, CandidateProfile, ExperienceItem } from "../../features/profile/services/profile.service";
import { useProfileStore } from "../../features/profile/stores/profile.store";

interface OnboardingProps {
  onComplete?: () => void;
}

const PARSE_STEPS = [
  "Reading document file bytes...",
  "Extracting normalized text content...",
  "Detecting resume section headings...",
  "Identifying technical skills against 150+ taxonomy...",
  "Auditing accomplishment bullets with Google XYZ rubric..."
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { setProfile, closeOnboarding } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States: "upload" -> "parsing" -> "review"
  const [step, setStep] = useState<"upload" | "parsing" | "review">("upload");
  const [parseStepIndex, setParseStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Extracted Profile State
  const [draftProfile, setDraftProfile] = useState<CandidateProfile | null>(null);
  const [newSkillInput, setNewSkillInput] = useState("");

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      setErrorMsg("Please upload a PDF (.pdf) or Word document (.docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10 MB. Please upload a smaller file.");
      return;
    }

    setErrorMsg("");
    setStep("parsing");
    setParseStepIndex(0);

    // Simulate progress through real stages as API call executes
    const timer = setInterval(() => {
      setParseStepIndex((prev) => (prev < PARSE_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await profileService.parseResume(file);
      clearInterval(timer);
      setParseStepIndex(PARSE_STEPS.length - 1);

      // Populate draft profile
      setDraftProfile(result.profile);
      setTimeout(() => {
        setStep("review");
      }, 300);
    } catch (err: any) {
      clearInterval(timer);
      console.error("Resume parse error", err);
      const detail = err.response?.data?.detail || "Could not read this resume file. Ensure it is a text-based PDF or DOCX.";
      setErrorMsg(detail);
      setStep("upload");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSaveProfile = async () => {
    if (!draftProfile) return;
    setIsSaving(true);
    setErrorMsg("");

    try {
      const saved = await profileService.saveProfile(draftProfile);
      setProfile(saved);
      if (onComplete) {
        onComplete();
      } else {
        closeOnboarding();
      }
    } catch (err: any) {
      console.error("Failed to save profile", err);
      setErrorMsg(err.response?.data?.detail || "Failed to save profile. Please check your inputs.");
      setIsSaving(false);
    }
  };

  // Skill Chip Handlers
  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !draftProfile) return;
    const trimmed = newSkillInput.trim();
    if (!draftProfile.skills.includes(trimmed)) {
      setDraftProfile({
        ...draftProfile,
        skills: [...draftProfile.skills, trimmed]
      });
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!draftProfile) return;
    setDraftProfile({
      ...draftProfile,
      skills: draftProfile.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Experience Handlers
  const handleUpdateExperience = (idx: number, field: keyof ExperienceItem, value: any) => {
    if (!draftProfile) return;
    const updated = [...draftProfile.experience];
    updated[idx] = { ...updated[idx], [field]: value };
    setDraftProfile({ ...draftProfile, experience: updated });
  };

  const handleUpdateBullet = (expIdx: number, bIdx: number, value: string) => {
    if (!draftProfile) return;
    const updated = [...draftProfile.experience];
    const bullets = [...updated[expIdx].bullets];
    bullets[bIdx] = value;
    updated[expIdx] = { ...updated[expIdx], bullets };
    setDraftProfile({ ...draftProfile, experience: updated });
  };

  const handleAddBullet = (expIdx: number) => {
    if (!draftProfile) return;
    const updated = [...draftProfile.experience];
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: [...updated[expIdx].bullets, ""]
    };
    setDraftProfile({ ...draftProfile, experience: updated });
  };

  const handleDeleteBullet = (expIdx: number, bIdx: number) => {
    if (!draftProfile) return;
    const updated = [...draftProfile.experience];
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: updated[expIdx].bullets.filter((_, i) => i !== bIdx)
    };
    setDraftProfile({ ...draftProfile, experience: updated });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-gradient)] bg-fixed text-[var(--text)] flex flex-col justify-between py-6 px-3 sm:px-6 md:py-10 select-none overflow-y-auto">
      {/* Top Brand Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[var(--divider)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] flex items-center justify-center text-[var(--accent)] shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="block text-[var(--text-sm)] font-semibold tracking-tight text-[var(--text)]">
              Career Companion
            </span>
            <span className="block text-[11px] text-[var(--text-muted)]">
              Local-First Candidate Onboarding
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
          <ShieldCheck size={14} className="text-[var(--success)]" />
          <span className="hidden sm:inline">100% Local Parsing</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl w-full mx-auto my-auto py-8">
        {/* ========================================================================= */}
        {/* STEP 1: DROPZONE UPLOAD                                                   */}
        {/* ========================================================================= */}
        {step === "upload" && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
            <div className="max-w-xl mx-auto mb-6">
              <Badge variant="emerald" size="sm" className="mb-3">
                First Launch Setup
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Welcome. Let’s load your real resume.
              </h1>
              <p className="mt-2.5 text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
                Career Companion uses your actual work history and verified skills to drive job discovery, pipeline tracking, and interview preparation.
              </p>
            </div>

            <Card className="w-full p-6 sm:p-10 flex flex-col items-center justify-center border-dashed border-2 hover:border-[var(--accent)] transition-all">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-8 sm:py-12 px-4 rounded-[var(--radius-lg)] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "bg-[color-mix(in_srgb,var(--accent)_12%,var(--glass-bg))] border-[var(--accent)]"
                    : "hover:bg-[var(--glass-bg-strong)]"
                }`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] text-[var(--accent)] flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm">
                  <UploadCloud size={28} />
                </div>

                <h3 className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-semibold text-[var(--text)]">
                  Drop your resume here, or browse files
                </h3>
                <p className="mt-1 text-[var(--text-xs)] text-[var(--text-muted)] max-w-sm">
                  Supports text-based PDF or DOCX documents up to 10 MB.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="w-full sm:w-auto"
                  >
                    <span>Browse computer</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] border border-[color-mix(in_srgb,var(--danger)_25%,transparent)] text-[var(--danger)] text-[var(--text-xs)] flex items-center gap-2 text-left w-full">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: REAL EXTRACTION PROGRESS                                          */}
        {/* ========================================================================= */}
        {step === "parsing" && (
          <Card className="w-full max-w-xl mx-auto p-6 sm:p-10 flex flex-col items-center text-center animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] text-[var(--accent)] flex items-center justify-center mb-5 animate-pulse">
              <FileText size={26} />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text)] tracking-tight">
              Parsing resume data...
            </h2>
            <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1 mb-8 max-w-sm">
              Analyzing text structure, contact points, and Google XYZ achievement rubrics locally.
            </p>

            {/* Stages List */}
            <div className="w-full space-y-3 text-left">
              {PARSE_STEPS.map((stageText, idx) => {
                const isDone = idx < parseStepIndex;
                const isCurrent = idx === parseStepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] text-[var(--text-xs)] transition-all ${
                      isCurrent
                        ? "bg-[var(--glass-bg-strong)] text-[var(--text)] border border-[var(--accent)] font-medium shadow-sm"
                        : isDone
                        ? "text-[var(--success)] opacity-90"
                        : "text-[var(--text-faint)] opacity-40"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-[var(--success)]" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)]" />
                      )}
                    </div>
                    <span className="truncate">{stageText}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: REVIEW & EDIT EXTRACTED PROFILE (Mobile-optimized)                */}
        {/* ========================================================================= */}
        {step === "review" && draftProfile && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--divider)]">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                  Confirm your candidate profile
                </h1>
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1">
                  Parsers are rarely 100% exact. Review and adjust your details below before launching the workspace.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep("upload")}
                leftIcon={<RotateCcw size={13} />}
                className="shrink-0 self-start sm:self-auto"
              >
                Upload different file
              </Button>
            </div>

            {/* ATS Audit Score Card */}
            <Card className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 bg-[color-mix(in_srgb,var(--glass-bg)_90%,transparent)]">
              <div className="flex items-center gap-4 shrink-0">
                <ProgressRing
                  value={draftProfile.ats_score || 85}
                  size={64}
                  strokeWidth={5}
                  color={
                    (draftProfile.ats_score || 85) >= 80
                      ? "emerald"
                      : (draftProfile.ats_score || 85) >= 60
                      ? "amber"
                      : "rose"
                  }
                  label={`${draftProfile.ats_score || 85}%`}
                />
                <div>
                  <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                    Google XYZ ATS Health
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Measurable impact & keyword readiness score
                  </p>
                </div>
              </div>

              {draftProfile.ats_issues && draftProfile.ats_issues.length > 0 && (
                <div className="flex-1 w-full pt-3 sm:pt-0 sm:pl-4 sm:border-l border-[var(--divider)] text-[var(--text-xs)]">
                  <span className="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider block mb-1">
                    Suggestions to strengthen:
                  </span>
                  <ul className="space-y-1 text-[var(--text-muted)] text-[11px]">
                    {draftProfile.ats_issues.slice(0, 2).map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[var(--warning)] mt-0.5">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Section 1: Personal & Contact Details */}
            <Card className="p-4 sm:p-6 space-y-4">
              <h2 className="text-[var(--text-sm)] font-semibold text-[var(--text)] flex items-center gap-2">
                <span>Personal & Contact Info</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Full Name *"
                  value={draftProfile.name}
                  onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                />

                <Input
                  label="Professional Headline"
                  value={draftProfile.headline || ""}
                  onChange={(e) => setDraftProfile({ ...draftProfile, headline: e.target.value })}
                  placeholder="e.g. Senior Full Stack & AI Systems Engineer"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={draftProfile.email || ""}
                  onChange={(e) => setDraftProfile({ ...draftProfile, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                />

                <Input
                  label="Phone Number"
                  value={draftProfile.phone || ""}
                  onChange={(e) => setDraftProfile({ ...draftProfile, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Current Location"
                    value={draftProfile.location || ""}
                    onChange={(e) => setDraftProfile({ ...draftProfile, location: e.target.value })}
                    placeholder="e.g. Bengaluru, India or Remote"
                  />
                </div>
              </div>
            </Card>

            {/* Section 2: Online Profiles & Links */}
            <Card className="p-4 sm:p-6 space-y-4">
              <h2 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                Online Profiles & Links
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="LinkedIn URL"
                  value={draftProfile.links?.linkedin || ""}
                  onChange={(e) =>
                    setDraftProfile({
                      ...draftProfile,
                      links: { ...draftProfile.links, linkedin: e.target.value }
                    })
                  }
                  placeholder="https://linkedin.com/in/username"
                />

                <Input
                  label="GitHub URL"
                  value={draftProfile.links?.github || ""}
                  onChange={(e) =>
                    setDraftProfile({
                      ...draftProfile,
                      links: { ...draftProfile.links, github: e.target.value }
                    })
                  }
                  placeholder="https://github.com/username"
                />
              </div>
            </Card>

            {/* Section 3: Summary / Bio */}
            <Card className="p-4 sm:p-6 space-y-3">
              <h2 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                Professional Summary
              </h2>
              <Textarea
                rows={3}
                value={draftProfile.summary || ""}
                onChange={(e) => setDraftProfile({ ...draftProfile, summary: e.target.value })}
                placeholder="High-signal summary of your technical engineering focus..."
              />
            </Card>

            {/* Section 4: Technical Skills Chips */}
            <Card className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">
                    Identified Technical Skills
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Used to calculate job match scores and keyword filters.
                  </p>
                </div>
                <span className="text-[var(--text-xs)] text-[var(--text-muted)] font-mono">
                  {draftProfile.skills.length} skills indexed
                </span>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {draftProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-xs text-[var(--text)] transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[var(--text-faint)] hover:text-[var(--danger)] cursor-pointer"
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom skill input */}
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--divider)]">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add skill (e.g. Redis, PyTorch, GraphQL)..."
                  className="flex-1 h-9 px-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-xs)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddSkill}
                  leftIcon={<Plus size={13} />}
                >
                  Add
                </Button>
              </div>
            </Card>

            {/* Section 5: Experience & Accomplishment Bullets */}
            <Card className="p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[var(--text-sm)] font-semibold text-[var(--text)] flex items-center gap-2">
                    <Briefcase size={15} className="text-[var(--accent)]" />
                    <span>Work Experience & Google XYZ Bullets</span>
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Audit achievement statements for action verbs and quantifiable metrics.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {draftProfile.experience.map((exp, expIdx) => (
                  <div
                    key={expIdx}
                    className="p-3.5 sm:p-4 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Company"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(expIdx, "company", e.target.value)}
                        placeholder="e.g. Razorpay"
                      />
                      <Input
                        label="Job Title"
                        value={exp.title}
                        onChange={(e) => handleUpdateExperience(expIdx, "title", e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)]">
                        <span>Accomplishment Bullets ({exp.bullets?.length || 0})</span>
                        <button
                          type="button"
                          onClick={() => handleAddBullet(expIdx)}
                          className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} />
                          <span>Add bullet</span>
                        </button>
                      </div>

                      {exp.bullets?.map((bText, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bText}
                            onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                            className="flex-1 p-2 rounded-[var(--radius-sm)] bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] text-[var(--text-xs)] text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none"
                            placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteBullet(expIdx, bIdx)}
                            className="p-1.5 text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors cursor-pointer shrink-0 mt-1"
                            title="Remove bullet"
                            aria-label="Remove bullet"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Error banner if any */}
            {errorMsg && (
              <div className="p-3.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] border border-[color-mix(in_srgb,var(--danger)_25%,transparent)] text-[var(--danger)] text-[var(--text-xs)] flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-3 z-30 p-3 sm:p-4 rounded-[var(--radius-lg)] glass border border-[var(--glass-border)] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--surface-solid)]/90 backdrop-blur-xl">
              <div className="hidden sm:block text-[var(--text-xs)] text-[var(--text-muted)]">
                Ready to explore real job matches and launch pipeline tracking.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep("upload")}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSaveProfile}
                  loading={isSaving}
                  disabled={!draftProfile.name.trim()}
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight size={15} />}
                >
                  {isSaving ? "Saving profile..." : "Confirm & Launch Workspace"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl w-full mx-auto pt-6 border-t border-[var(--divider)] text-center text-[11px] text-[var(--text-muted)]">
        Career Companion • Local-first privacy architecture. Your profile data never leaves your computer.
      </footer>
    </div>
  );
}


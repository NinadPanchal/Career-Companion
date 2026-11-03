import { useState, useEffect } from "react";
import { Zap, CheckCircle2, User, Mail, Phone, MapPin, FileText, Send } from "lucide-react";
import { DiscoveredJob } from "../stores/jobs.store";
import { useResumeStore } from "../../resume/stores/resume.store";
import { useProfileStore } from "../../profile/stores/profile.store";
import { Button, Badge, Modal, Input, Textarea } from "../../../components/ui";
import { useApplicationsStore } from "../../applications/stores/applications.store";

interface EasyApplyModalProps {
  job: DiscoveredJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: DiscoveredJob) => void;
}

export default function EasyApplyModal({ job, isOpen, onClose, onSuccess }: EasyApplyModalProps) {
  const { analysis, file } = useResumeStore();
  const { profile } = useProfileStore();
  const { addApplication } = useApplicationsStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const candidateSkills = profile?.skills?.length
    ? profile.skills
    : analysis?.skills?.length
    ? analysis.skills
    : [];

  // Form states
  const [fullName, setFullName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [coverNote, setCoverNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (profile) {
        setFullName(profile.name || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setLocation(profile.location || "");
      }
      const skillsStr = candidateSkills.slice(0, 4).join(", ") || "full-stack development";
      setCoverNote(
        `Hi Hiring Team at ${job?.company_name || 'Company'},\n\nI am applying for the ${job?.title || 'position'} role. With proven competencies in ${skillsStr}, I look forward to discussing how my experience can contribute to your team.`
      );
      setStep(1);
      setSubmitted(false);
      setErrorMessage("");
    }
  }, [isOpen, profile, job]);

  if (!job) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await addApplication({
        title: job.title,
        company_name: job.company_name,
        location: job.location || "Mumbai, India",
        url: job.url || "",
        status: "applied",
        notes: `Application recorded via Career Companion. Cover statement: "${coverNote.slice(0, 100)}..."`,
      });
      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        onSuccess(job);
        setSubmitted(false);
        setStep(1);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to submit application", err);
      setIsSubmitting(false);
      setErrorMessage("Could not submit application. Please check your connection and retry.");
    }
  };

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] p-2 text-[var(--accent)] shrink-0">
        <Zap size={18} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">Direct Application</h2>
          <Badge variant="offer" size="sm">
            Verified
          </Badge>
        </div>
        <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1">
          {job.title} • <span className="font-medium text-[var(--text)]">{job.company_name}</span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      {submitted ? (
        <div className="py-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)]">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-[var(--text-lg)] font-semibold text-[var(--text)]">Application Filed</h3>
          <p className="mt-1.5 text-[var(--text-xs)] text-[var(--text-muted)] max-w-sm mx-auto">
            Candidate record and parsed competencies recorded in your application pipeline for {job.company_name}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stepper Header */}
          <div className="flex items-center justify-between text-[var(--text-xs)] font-medium text-[var(--text-muted)] border-b border-[var(--divider)] pb-2.5">
            <span className={step >= 1 ? "text-[var(--accent)] font-semibold" : ""}>1. Contact Info</span>
            <span className={step >= 2 ? "text-[var(--accent)] font-semibold" : ""}>2. Resume & Skills</span>
            <span className={step >= 3 ? "text-[var(--accent)] font-semibold" : ""}>3. Review & Send</span>
          </div>

          {step === 1 && (
            <div className="space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  leftIcon={<User size={14} />}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  leftIcon={<Mail size={14} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  leftIcon={<Phone size={14} />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Location"
                  leftIcon={<MapPin size={14} />}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => setStep(2)}>
                  Next: Resume Details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3.5">
              <div className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-[var(--success)]" />
                    <div className="min-w-0">
                      <p className="text-[var(--text-xs)] font-semibold text-[var(--text)]">Primary Profile Resume</p>
                      <p className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[200px]">
                        {profile?.resume_filename || file?.name || "Active Resume"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="offer" size="sm">
                    {profile ? `${profile.ats_score || 85}% ATS` : "ATS Ready"}
                  </Badge>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[var(--divider)] flex flex-wrap gap-1">
                  {candidateSkills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] border border-[color-mix(in_srgb,var(--success)_24%,transparent)] text-[10px] font-mono"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <Textarea
                label="Custom Note / Statement of Interest"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
              />

              <div className="flex justify-between pt-2 border-t border-[var(--divider)]">
                <Button variant="secondary" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" size="sm" onClick={() => setStep(3)}>
                  Next: Review
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3.5">
              <div className="rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3 text-[var(--text-xs)] space-y-2">
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Role Target:</span>
                  <span className="text-[var(--text)] font-medium">{job.title} at {job.company_name}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Candidate:</span>
                  <span className="text-[var(--text)] font-medium">{fullName} ({email})</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Action:</span>
                  <span className="text-[var(--success)] font-mono">Filing to Kanban Pipeline ("applied")</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-[var(--radius-sm)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 text-[var(--text-xs)] text-[var(--danger)]">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-[var(--divider)]">
                <Button variant="secondary" size="sm" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  leftIcon={<Send size={13} />}
                >
                  {isSubmitting ? "Filing..." : "Confirm & Send"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

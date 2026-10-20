import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, CheckCircle2, User, Mail, Phone, MapPin, FileText, Send } from "lucide-react";
import { DiscoveredJob } from "../stores/jobs.store";
import { useResumeStore } from "../../resume/stores/resume.store";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

import { useApplicationsStore } from "../../applications/stores/applications.store";

interface EasyApplyModalProps {
  job: DiscoveredJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: DiscoveredJob) => void;
}

export default function EasyApplyModal({ job, isOpen, onClose, onSuccess }: EasyApplyModalProps) {
  const { analysis } = useResumeStore();
  const { addApplication } = useApplicationsStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [fullName, setFullName] = useState("Ninad Panchal");
  const [email, setEmail] = useState("ninad.panchal@career-companion.app");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Mumbai, Maharashtra, India");
  const [coverNote, setCoverNote] = useState(
    `Hi Hiring Team at ${job?.company_name || 'Company'},\n\nI am applying for the ${job?.title || 'position'} role. With strong skills in ${analysis?.skills?.slice(0, 4).join(', ') || 'software engineering, Python, and React'}, I am confident in delivering high impact.`
  );

  if (!isOpen || !job) return null;

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[12px] border border-white/[0.16] bg-[#18181b] p-5 sm:p-6 text-[#f4f4f5] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] font-sans"
        >
          {/* Top Header */}
          <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-[8px] bg-[#10b981]/10 border border-[#10b981]/20 p-2 text-[#10b981]">
                <Zap size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-semibold text-[#f4f4f5]">Direct Application</h2>
                  <Badge variant="offer" size="sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-[#a1a1aa] mt-0.5">
                  {job.title} • <span className="font-medium text-[#f4f4f5]">{job.company_name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-[6px] p-1.5 text-[#71717a] transition hover:bg-white/[0.06] hover:text-[#f4f4f5] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-base font-semibold text-[#f4f4f5]">Application Filed</h3>
              <p className="mt-1.5 text-xs text-[#a1a1aa] max-w-sm mx-auto">
                Candidate record and parsed competencies recorded in your application pipeline for {job.company_name}.
              </p>
            </div>
          ) : (
            <div>
              {/* Stepper Header */}
              <div className="mb-4 flex items-center justify-between text-xs font-medium text-[#71717a] border-b border-white/[0.06] pb-2">
                <span className={step >= 1 ? "text-[#10b981] font-semibold" : ""}>1. Contact Info</span>
                <span className={step >= 2 ? "text-[#10b981] font-semibold" : ""}>2. Resume & Skills</span>
                <span className={step >= 3 ? "text-[#10b981] font-semibold" : ""}>3. Review & Send</span>
              </div>

              {step === 1 && (
                <div className="space-y-3.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-[#a1a1aa]">Full Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#a1a1aa]">Email Address</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#a1a1aa]">Phone Number</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#a1a1aa]">Location</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full h-8 pl-8 pr-3 bg-[#09090b] border border-white/[0.08] focus:border-[#10b981] rounded-[8px] text-xs text-[#f4f4f5] outline-none"
                        />
                      </div>
                    </div>
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
                  <div className="rounded-[8px] border border-white/[0.08] bg-[#09090b] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-[#10b981]" />
                        <div>
                          <p className="text-xs font-semibold text-[#f4f4f5]">Primary Profile Resume</p>
                          <p className="text-[11px] font-mono text-[#71717a]">parsed_resume_v2.pdf</p>
                        </div>
                      </div>
                      <Badge variant="offer" size="sm">
                        ATS Ready
                      </Badge>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-wrap gap-1">
                      {(analysis?.skills?.slice(0, 5) || ["Python", "FastAPI", "React", "Docker"]).map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 rounded-[4px] bg-white/[0.04] text-[#10b981] border border-[#10b981]/20 text-[10px] font-mono"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-[#a1a1aa]">
                      Custom Note / Statement of Interest
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full rounded-[8px] border border-white/[0.08] bg-[#09090b] p-2.5 text-xs text-[#f4f4f5] outline-none focus:border-[#10b981]"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
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
                  <div className="rounded-[8px] border border-white/[0.08] bg-[#09090b] p-3 text-xs space-y-2">
                    <div className="flex justify-between text-[#71717a]">
                      <span>Role Target:</span>
                      <span className="text-[#f4f4f5] font-medium">{job.title} at {job.company_name}</span>
                    </div>
                    <div className="flex justify-between text-[#71717a]">
                      <span>Candidate:</span>
                      <span className="text-[#f4f4f5] font-medium">{fullName} ({email})</span>
                    </div>
                    <div className="flex justify-between text-[#71717a]">
                      <span>Action:</span>
                      <span className="text-[#10b981] font-mono">Filing to Kanban Pipeline ("applied")</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-2.5 rounded-[6px] border border-rose-500/20 bg-rose-500/10 text-xs text-rose-300">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="secondary" size="sm" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="gap-1.5"
                    >
                      <Send size={13} />
                      <span>{isSubmitting ? "Filing..." : "Confirm & Send"}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

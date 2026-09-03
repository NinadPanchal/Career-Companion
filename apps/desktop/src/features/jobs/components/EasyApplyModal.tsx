import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, CheckCircle2, User, Mail, Phone, MapPin, FileText, Sparkles, Send } from "lucide-react";
import { DiscoveredJob } from "../stores/jobs.store";
import { useResumeStore } from "../../resume/stores/resume.store";
import { Button } from "../../../components/ui/Button";

interface EasyApplyModalProps {
  job: DiscoveredJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (job: DiscoveredJob) => void;
}

export default function EasyApplyModal({ job, isOpen, onClose, onSuccess }: EasyApplyModalProps) {
  const { analysis } = useResumeStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("Ninad Panchal");
  const [email, setEmail] = useState("ninad.panchal@career-companion.app");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Bengaluru, Karnataka, India");
  const [coverNote, setCoverNote] = useState(
    `Hi Hiring Team at ${job?.company_name || 'Company'},\n\nI am excited to apply for the ${job?.title || 'position'} role. With strong skills in ${analysis?.skills?.slice(0, 4).join(', ') || 'software engineering, Python, and React'}, I am confident in delivering high impact.`
  );

  if (!isOpen || !job) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate lightning fast 1-click application submit
    await new Promise((res) => setTimeout(res, 600));
    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onSuccess(job);
      setSubmitted(false);
      setStep(1);
      onClose();
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-950 p-6 text-white shadow-2xl"
        >
          {/* Top banner */}
          <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
                <Zap size={22} className="fill-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">⚡ Easy Apply</h2>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    LinkedIn Style 1-Click
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  {job.title} • <span className="font-semibold text-zinc-300">{job.company_name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {submitted ? (
            <div className="py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              >
                <CheckCircle2 size={36} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Your profile and parsed resume skills were delivered directly to {job.company_name}.
              </p>
            </div>
          ) : (
            <div>
              {/* Progress Steps */}
              <div className="mb-6 flex items-center justify-between text-xs font-semibold text-zinc-400">
                <span className={step >= 1 ? "text-emerald-400" : ""}>1. Contact Information</span>
                <span className={step >= 2 ? "text-emerald-400" : ""}>2. Resume & Skills</span>
                <span className={step >= 3 ? "text-emerald-400" : ""}>3. Review & Submit</span>
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300">Confirm Your Contact Information</h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Phone Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setStep(2)}>Next: Resume →</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-300">Attached Resume & Skills Match</h3>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-emerald-400" size={24} />
                        <div>
                          <p className="font-semibold text-white">Ninad_Panchal_Resume.pdf</p>
                          <p className="text-xs text-emerald-300/80">Active Resume • Parsed by Local AI</p>
                        </div>
                      </div>
                      <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                        {job.match_score ?? 85}% Skill Match
                      </span>
                    </div>

                    {job.matched_skills && job.matched_skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-emerald-500/20 pt-3">
                        {job.matched_skills.map((s) => (
                          <span key={s} className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                    <Button onClick={() => setStep(3)}>Next: Pitch Note →</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-300">AI Application Pitch Note</h3>
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><Sparkles size={12} /> Tailored to {job.company_name}</span>
                  </div>

                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-white outline-none focus:border-emerald-500"
                  />

                  <div className="mt-6 flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2">
                      <Send size={16} />
                      {isSubmitting ? "Submitting..." : "Submit ⚡ Easy Apply"}
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

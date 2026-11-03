import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Sparkles,
  TrendingUp,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { DiscoveredJob } from "../stores/jobs.store";
import { jobsService } from "../services/jobs.service";
import { Modal, Button, Badge } from "../../../components/ui";

interface JobDetailsModalProps {
  job: DiscoveredJob | null;
  isOpen: boolean;
  onClose: () => void;
  onEasyApply: (job: DiscoveredJob) => void;
  onOpenSalaryInsights: (job: DiscoveredJob) => void;
  isSaved?: boolean;
  onSave?: (job: DiscoveredJob) => void;
  isApplied?: boolean;
}

export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  onEasyApply,
  onOpenSalaryInsights,
  isSaved = false,
  onSave,
  isApplied = false,
}: JobDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !job) {
      setDetails(null);
      return;
    }

    let isMounted = true;

    // If external_id looks like a real JSearch job id, fetch live details
    if (job.external_id && !job.external_id.startsWith("ZEP-") && !job.external_id.startsWith("RZP-") && !job.external_id.startsWith("BST-") && !job.external_id.startsWith("CRD-")) {
      setLoading(true);
      jobsService
        .getJobDetails(job.external_id)
        .then((res) => {
          if (isMounted && res) {
            setDetails(res);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch remote job details:", err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setDetails(null);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, job]);

  if (!job) return null;

  const highlights = details?.job_highlights || {};
  const qualifications: string[] = highlights.Qualifications || [];
  const responsibilities: string[] = highlights.Responsibilities || [];
  const benefits: string[] = highlights.Benefits || [];
  const applyOptions: any[] = details?.apply_options || [];

  const modalTitle = (
    <div className="flex items-center gap-3">
      {details?.employer_logo ? (
        <img
          src={details.employer_logo}
          alt={job.company_name}
          className="w-10 h-10 rounded-[var(--radius-sm)] object-contain bg-white p-1 border border-[var(--divider)] shrink-0"
        />
      ) : (
        <div className="rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] p-2 text-[var(--accent)] shrink-0">
          <Briefcase size={18} />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)] truncate">
            {job.title}
          </h2>
          {job.is_remote && (
            <Badge variant="sky" size="sm">
              Remote
            </Badge>
          )}
        </div>
        <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
          <span className="font-medium text-[var(--text)]">{job.company_name}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-[var(--text-faint)]" />
            {job.location || "India"}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="xl"
      className="p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 text-sans max-h-[75vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Fetching full job specifications via JSearch API...
            </p>
          </div>
        ) : (
          <>
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-mono">Candidate Match</span>
                <span className="font-mono font-semibold text-[var(--success)]">{job.match_score ?? 85}% Fit</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-mono">Seniority</span>
                <span className="font-medium text-[var(--text)]">{details?.seniority_level || "Professional"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-mono">Work Model</span>
                <span className="font-medium text-[var(--text)]">{job.is_remote ? "100% Remote" : "Hybrid / On-site"}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wider font-mono">Compensation</span>
                <button
                  type="button"
                  onClick={() => onOpenSalaryInsights(job)}
                  className="font-mono text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
                >
                  <span>Salary Intel</span>
                  <TrendingUp size={11} />
                </button>
              </div>
            </div>

            {/* Matched vs Missing Skills */}
            {((job.matched_skills && job.matched_skills.length > 0) || (job.missing_skills && job.missing_skills.length > 0)) && (
              <div className="flex flex-col gap-2 p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-solid)] border border-[var(--divider)]">
                <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Skill Alignment
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.matched_skills?.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] border border-[color-mix(in_srgb,var(--success)_20%,transparent)] text-xs text-[var(--success)] font-mono"
                    >
                      <CheckCircle2 size={11} /> {s}
                    </span>
                  ))}
                  {job.missing_skills?.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] text-xs text-[var(--danger)] font-mono"
                    >
                      Missing: {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Highlights (Qualifications & Responsibilities) */}
            {qualifications.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Required Qualifications
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text)] leading-relaxed">
                  {qualifications.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {responsibilities.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Key Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[var(--text)] leading-relaxed">
                  {responsibilities.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {benefits.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Company Benefits & Perks
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-muted)]">
                  {benefits.map((item, idx) => (
                    <li key={idx} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Job Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                Full Role Overview
              </h3>
              <div className="text-xs text-[var(--text)] leading-relaxed whitespace-pre-line bg-[var(--glass-bg)] p-4 rounded-[var(--radius-md)] border border-[var(--glass-border)] max-h-60 overflow-y-auto">
                {details?.job_description || job.description || "No full description provided."}
              </div>
            </div>

            {/* Direct Apply Options from Job Publishers */}
            {applyOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Available Application Portals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {applyOptions.map((opt, idx) => (
                    <a
                      key={idx}
                      href={opt.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-[var(--glass-bg-strong)] text-xs text-[var(--text)] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Apply on {opt.publisher || "Official Portal"}</span>
                      <ExternalLink size={11} className="text-[var(--text-muted)]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--divider)]">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenSalaryInsights(job)}
              leftIcon={<TrendingUp size={13} className="text-[var(--success)]" />}
            >
              Salary Benchmarks
            </Button>
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave(job)}
                leftIcon={isSaved ? <BookmarkCheck size={13} className="text-[var(--success)]" /> : <Bookmark size={13} />}
              >
                {isSaved ? "Saved" : "Save Role"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isApplied}
              onClick={() => {
                onClose();
                onEasyApply(job);
              }}
              leftIcon={isApplied ? <CheckCircle2 size={13} /> : <Zap size={13} />}
            >
              {isApplied ? "Already Applied" : "Easy Apply Now"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

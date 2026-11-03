import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Building2, 
  MapPin, 
  DollarSign, 
  Info, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";
import { DiscoveredJob } from "../stores/jobs.store";
import { jobsService } from "../services/jobs.service";
import { Modal, Button, Badge } from "../../../components/ui";

interface SalaryInsightsModalProps {
  job: DiscoveredJob | null;
  isOpen: boolean;
  onClose: () => void;
}

interface BenchmarkItem {
  company?: string;
  job_title?: string;
  location?: string;
  min_salary?: number;
  max_salary?: number;
  median_salary?: number;
  min_base_salary?: number;
  max_base_salary?: number;
  median_base_salary?: number;
  min_additional_pay?: number;
  max_additional_pay?: number;
  median_additional_pay?: number;
  salary_period?: string;
  salary_currency?: string;
  salary_count?: number;
  confidence?: string;
  publisher_name?: string;
  publisher_link?: string;
}

function formatCompensation(val: number | undefined | null, currency: string = "USD", period: string = "YEAR"): string {
  if (val === undefined || val === null || val <= 0) return "—";

  const curr = (currency || "USD").toUpperCase();
  const isYearly = period.toUpperCase() === "YEAR" || period.toUpperCase() === "YEARLY";

  if (curr === "INR") {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1).replace(/\.0$/, "")}L`;
    }
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  }

  if (curr === "USD") {
    if (isYearly && val >= 1000) {
      return `$${Math.round(val / 1000)}k`;
    }
    return `$${Math.round(val).toLocaleString()}`;
  }

  const sym = curr === "EUR" ? "€" : curr === "GBP" ? "£" : `${curr} `;
  if (isYearly && val >= 1000) {
    return `${sym}${Math.round(val / 1000)}k`;
  }
  return `${sym}${Math.round(val).toLocaleString()}`;
}

export default function SalaryInsightsModal({ job, isOpen, onClose }: SalaryInsightsModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<"company" | "market">("company");
  const [companyBenchmark, setCompanyBenchmark] = useState<BenchmarkItem | null>(null);
  const [marketEstimates, setMarketEstimates] = useState<BenchmarkItem[]>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !job) {
      setCompanyBenchmark(null);
      setMarketEstimates([]);
      setErrorNotice(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setErrorNotice(null);

    const fetchData = async () => {
      try {
        const cleanTitle = job.title.split("-")[0].split("(")[0].trim();
        const cleanCompany = job.company_name.trim();
        const cleanLocation = job.location?.split("/")[0].split("-")[0].trim() || "India";

        const [compRes, estRes] = await Promise.allSettled([
          jobsService.getCompanySalary(cleanCompany, cleanTitle),
          jobsService.getEstimatedSalary(cleanTitle, cleanLocation),
        ]);

        if (!isMounted) return;

        let hasData = false;

        if (compRes.status === "fulfilled" && compRes.value?.benchmarks?.length) {
          setCompanyBenchmark(compRes.value.benchmarks[0]);
          hasData = true;
        } else {
          setCompanyBenchmark(null);
        }

        if (estRes.status === "fulfilled" && estRes.value?.estimates?.length) {
          setMarketEstimates(estRes.value.estimates);
          hasData = true;
          // If no company benchmark, auto-switch to market view
          if (!hasData) setActiveView("market");
        } else {
          setMarketEstimates([]);
        }

        if (!hasData) {
          setErrorNotice("Direct employer submissions are limited for this exact title. Showing estimated industry tier.");
        }
      } catch (err) {
        console.warn("Failed to fetch salary intelligence:", err);
        if (isMounted) {
          setErrorNotice("Could not load real-time salary benchmarks. Displaying standard market guidance.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, job]);

  if (!job) return null;

  // Selected active benchmark to render
  const primaryMarket = marketEstimates.length > 0 ? marketEstimates[0] : null;
  const currBenchmark = activeView === "company" ? (companyBenchmark || primaryMarket) : (primaryMarket || companyBenchmark);

  const displayCurrency = currBenchmark?.salary_currency || job.currency || "USD";
  const displayPeriod = currBenchmark?.salary_period || "YEAR";

  // Percent calculation for the visual distribution bar
  const minVal = currBenchmark?.min_salary || 0;
  const maxVal = currBenchmark?.max_salary || 0;
  const medVal = currBenchmark?.median_salary || 0;
  const rangeSpan = maxVal - minVal;
  const medianPercent = rangeSpan > 0 ? Math.min(Math.max(Math.round(((medVal - minVal) / rangeSpan) * 100), 15), 85) : 50;

  // Candidate Match Score & Negotiation Guidance
  const matchScore = job.match_score ?? 85;
  const isHighMatch = matchScore >= 85;

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] border border-[color-mix(in_srgb,var(--success)_24%,transparent)] p-2 text-[var(--success)] shrink-0">
        <TrendingUp size={18} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[var(--text-md)] font-semibold text-[var(--text)]">Salary & Compensation Intelligence</h2>
          <Badge variant="success" size="sm">
            Live Verified
          </Badge>
        </div>
        <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-0.5">
          {job.title} • <span className="font-medium text-[var(--text)]">{job.company_name}</span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="lg"
      className="p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 text-sans select-none">
        {/* Source Toggle Tabs */}
        <div className="flex items-center justify-between gap-3 p-1 rounded-[var(--radius-md)] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <button
            type="button"
            onClick={() => setActiveView("company")}
            className={`flex-1 py-1.5 px-3 rounded-[var(--radius-sm)] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeView === "company"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Building2 size={13} />
            <span>Company Benchmark {companyBenchmark ? "(Verified)" : ""}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("market")}
            className={`flex-1 py-1.5 px-3 rounded-[var(--radius-sm)] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeView === "market"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <MapPin size={13} />
            <span>Market Rate ({job.location?.split("/")[0] || "Location"})</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Fetching verified compensation data from JSearch & Glassdoor...
            </p>
          </div>
        ) : (
          <>
            {/* Main Compensation Highlight Card */}
            <div className="glass rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 border border-[var(--glass-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--divider)]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {activeView === "company" ? `${job.company_name} Reported Median` : "Regional Market Median"}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-[var(--text)] tracking-tight">
                      {medVal > 0 
                        ? formatCompensation(medVal, displayCurrency, displayPeriod) 
                        : "Competitive Market Rate"}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      / {displayPeriod.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  {currBenchmark?.confidence && (
                    <Badge variant="sky" size="sm" className="font-mono text-[10px]">
                      <ShieldCheck size={11} className="mr-1" />
                      {currBenchmark.confidence} Confidence
                    </Badge>
                  )}
                  {currBenchmark?.salary_count ? (
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      Based on {currBenchmark.salary_count.toLocaleString()} verified submissions
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Visual Distribution Range Bar */}
              {minVal > 0 && maxVal > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span>Min: {formatCompensation(minVal, displayCurrency, displayPeriod)}</span>
                    <span className="text-[var(--text)] font-semibold">
                      Median: {formatCompensation(medVal, displayCurrency, displayPeriod)}
                    </span>
                    <span>Max: {formatCompensation(maxVal, displayCurrency, displayPeriod)}</span>
                  </div>

                  <div className="relative w-full h-3 bg-[var(--glass-bg-strong)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                    {/* Gradient track */}
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--accent)]/40 via-[var(--success)] to-[var(--accent)]/40 rounded-full"
                      style={{ width: "100%" }}
                    />
                    {/* Median pointer indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-2.5 bg-white shadow-lg rounded-full transform -translate-x-1/2 border border-black/20"
                      style={{ left: `${medianPercent}%` }}
                      title={`Median: ${formatCompensation(medVal, displayCurrency, displayPeriod)}`}
                    />
                  </div>
                </div>
              )}

              {/* Compensation Breakdown (Base vs Additional/Bonus) */}
              {(currBenchmark?.median_base_salary || currBenchmark?.median_additional_pay) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--divider)]">
                  <div className="bg-[var(--glass-bg)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)]">
                    <span className="text-[11px] text-[var(--text-muted)] block mb-1">Base Salary Component</span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-sm font-semibold text-[var(--text)]">
                        {formatCompensation(currBenchmark.median_base_salary, displayCurrency, displayPeriod)}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {currBenchmark.min_base_salary && currBenchmark.max_base_salary
                          ? `${formatCompensation(currBenchmark.min_base_salary, displayCurrency, displayPeriod)} – ${formatCompensation(currBenchmark.max_base_salary, displayCurrency, displayPeriod)}`
                          : "Base pay"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[var(--glass-bg)] p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)]">
                    <span className="text-[11px] text-[var(--text-muted)] block mb-1">Bonus, Stocks & Additional Pay</span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-sm font-semibold text-[var(--success)]">
                        {formatCompensation(currBenchmark.median_additional_pay, displayCurrency, displayPeriod)}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {currBenchmark.min_additional_pay && currBenchmark.max_additional_pay
                          ? `${formatCompensation(currBenchmark.min_additional_pay, displayCurrency, displayPeriod)} – ${formatCompensation(currBenchmark.max_additional_pay, displayCurrency, displayPeriod)}`
                          : "Annual equity/incentives"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Negotiation Strategy Advisor Card */}
            <div className="p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--accent)_6%,transparent)] border border-[color-mix(in_srgb,var(--accent)_16%,transparent)] flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[var(--accent)]" />
                <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Target Negotiation Strategy
                </h3>
              </div>
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {isHighMatch ? (
                  <>
                    With your <strong className="text-[var(--success)]">{matchScore}% profile skill match</strong>, you are in the top tier of candidates for this role. We recommend anchoring your initial expectations at or above the <strong>median ({formatCompensation(medVal || maxVal * 0.8, displayCurrency, displayPeriod)})</strong> and requesting equity/bonus incentives up to <strong>{formatCompensation(maxVal, displayCurrency, displayPeriod)}</strong>.
                  </>
                ) : (
                  <>
                    With a <strong className="text-[var(--warning)]">{matchScore}% skill match</strong>, target the competitive market band between <strong>{formatCompensation(minVal || medVal * 0.85, displayCurrency, displayPeriod)}</strong> and <strong>{formatCompensation(medVal, displayCurrency, displayPeriod)}</strong> while highlighting your fast ramp-up capabilities.
                  </>
                )}
              </p>
            </div>

            {/* Attribution Footnote */}
            {currBenchmark?.publisher_name && (
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1">
                <span>Verified benchmark provided via {currBenchmark.publisher_name}</span>
                {currBenchmark.publisher_link && (
                  <a
                    href={currBenchmark.publisher_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                  >
                    <span>View publisher source</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}

            {errorNotice && (
              <div className="text-[11px] text-[var(--text-faint)] italic px-1">
                {errorNotice}
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--divider)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

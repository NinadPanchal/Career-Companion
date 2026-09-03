import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  FileText, 
  Search, 
  Target, 
  Kanban, 
  Send, 
  Bot,
  ChevronRight
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Resume Analysis",
      description: "Parse PDF and DOCX resumes. Get ATS compatibility scores and rewrite bullets using proven impact formulas.",
    },
    {
      icon: Target,
      title: "Skill Matching",
      description: "Percentage match scores against live job postings with highlighted skill gaps and recommendations.",
    },
    {
      icon: Search,
      title: "Job Discovery",
      description: "Search tech roles across Indian hubs and global remote opportunities from multiple job boards.",
    },
    {
      icon: Kanban,
      title: "Application Pipeline",
      description: "Track every application from discovery to offer with a Kanban board, notes, and interview stages.",
    },
    {
      icon: Send,
      title: "Cover Letters",
      description: "Generate targeted cover letters, LinkedIn referral messages, and cold outreach emails.",
    },
    {
      icon: Bot,
      title: "Interview Prep",
      description: "Practice behavioral and technical questions with timed sessions and structured feedback.",
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#09090b] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#09090b]/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
            <span className="text-xs font-bold text-black">CC</span>
          </div>
          <span className="text-sm font-semibold">Career Companion</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-24 text-center animate-slide-up">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Now with Neon Serverless Postgres
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Your job search,{" "}
          <span className="text-emerald-400">organized.</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base text-zinc-400 leading-relaxed">
          Career Companion helps you parse resumes, discover matching jobs, craft cover letters, prepare for interviews, and track your entire application pipeline — all in one place.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            Open Dashboard <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate("/resume")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.06]"
          >
            Upload Resume
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold tracking-tight">Everything you need</h2>
          <p className="mt-2 text-sm text-zinc-500">Six integrated tools to streamline your job search.</p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col bg-[#09090b] p-6 transition-colors hover:bg-white/[0.02]"
            >
              <feature.icon size={18} className="mb-3 text-zinc-500 transition-colors group-hover:text-emerald-400" strokeWidth={1.5} />
              <h3 className="mb-1.5 text-sm font-semibold text-zinc-200">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-xl font-semibold tracking-tight">Ready to get started?</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Free and open-source. Runs locally with your data, or connect to Neon cloud Postgres.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Launch App <ChevronRight size={15} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400">
              <span className="text-[9px] font-bold">CC</span>
            </div>
            <span>Career Companion</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>React + FastAPI + Neon Postgres</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
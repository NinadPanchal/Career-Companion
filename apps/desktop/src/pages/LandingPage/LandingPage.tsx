import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  Target,
  Kanban,
  Send,
  Bot,
  Mail,
  ExternalLink,
  Code2,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  User,
  Terminal,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../components/ui/Icons";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: "resume-ats",
      icon: FileText,
      title: "Resume & ATS Analysis",
      path: "/resume",
      description:
        "Parses PDF and DOCX resumes into structured JSON. Identifies formatting flags and evaluates bullet point impact using the Google XYZ accomplishment framework.",
      actionText: "Open Resume Scanner",
    },
    {
      id: "skill-matching",
      icon: Target,
      title: "Skill Gap Matching",
      path: "/jobs",
      description:
        "Calculates deterministic compatibility scores between your parsed competencies and live job requirement vectors to spotlight missing skills.",
      actionText: "Explore Match Scores",
    },
    {
      id: "job-discovery",
      icon: Search,
      title: "Job Discovery",
      path: "/jobs",
      description:
        "Aggregates engineering and data science roles across Indian tech hubs (Bengaluru, Hyderabad, Pune, NCR) and remote openings.",
      actionText: "Search Tech Jobs",
    },
    {
      id: "pipeline-tracking",
      icon: Kanban,
      title: "Application Pipeline",
      path: "/applications",
      description:
        "Tracks applications across 5 stages (Wishlist, Applied, Interviewing, Offer, Rejected) with compensation notes and interview dates.",
      actionText: "View Kanban Board",
    },
    {
      id: "outreach-generation",
      icon: Send,
      title: "Targeted Outreach",
      path: "/cover-letter",
      description:
        "Generates tailored cover letters, concise LinkedIn referral messages, and hiring manager cold emails aligned to the target job description.",
      actionText: "Draft Outreach",
    },
    {
      id: "interview-prep",
      icon: Bot,
      title: "STAR Interview Simulator",
      path: "/interview-prep",
      description:
        "Timed mock interview practice with real-time feedback on STAR (Situation, Task, Action, Result) structure and clarity.",
      actionText: "Practice Interviews",
    },
  ];

  const techStack = [
    {
      icon: Terminal,
      title: "FastAPI Backend",
      detail: "Python 3.13 async REST API with Pydantic validation and modular routers.",
    },
    {
      icon: Database,
      title: "PostgreSQL & SQLite",
      detail: "SQLAlchemy 2.0 async engine supporting local zero-config SQLite and cloud Neon Postgres.",
    },
    {
      icon: Code2,
      title: "React 19 & TypeScript",
      detail: "Component architecture with Vite, Tailwind CSS tokens, and Zustand state persistence.",
    },
    {
      icon: Cpu,
      title: "Hybrid AI Engine",
      detail: "Algorithmic NLP scoring with fallback heuristics that run offline without mandatory API keys.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
            aria-label="Career Companion Home"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-xs font-bold text-black shadow-sm">
              CC
            </span>
            <span>Career Companion</span>
          </a>

          {/* Section Navigation Links */}
          <nav aria-label="Page Sections" className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#architecture" className="transition-colors hover:text-white">
              Architecture
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/NinadPanchal/Career-Companion"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white"
              aria-label="GitHub Repository (opens in new tab)"
            >
              <GithubIcon width={13} height={13} />
              <span>Source</span>
            </a>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="mx-auto max-w-4xl px-6 pb-20 pt-20 text-center sm:pt-28"
        >
          {/* Engineering Student Context Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Final-Year B.E. AI & DS Capstone Project</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Bengaluru, India</span>
          </div>

          <h1
            id="hero-title"
            className="text-3xl font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.15]"
          >
            A focused engineering workbench for{" "}
            <span className="text-emerald-400">tech job searches</span>.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-400 sm:text-lg sm:leading-relaxed">
            Career Companion replaces disorganized spreadsheets with an integrated, local-first platform.
            Parse resumes, calculate skill match percentages against live openings, structure STAR interview responses, and track your application lifecycle.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/resume")}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/[0.18] hover:bg-white/[0.06]"
            >
              <FileText size={16} />
              <span>Resume & ATS Scanner</span>
            </button>

            <a
              href="https://github.com/NinadPanchal/Career-Companion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              <GithubIcon width={15} height={15} />
              <span>GitHub Code</span>
              <ExternalLink size={12} className="text-zinc-500" />
            </a>
          </div>

          {/* Quick Technical Highlights Strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 border-t border-white/[0.06] pt-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Python FastAPI Engine
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> PostgreSQL & SQLite
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Offline Heuristics Fallback
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Free & Open Source
            </span>
          </div>
        </section>

        {/* Core Modules Section */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-20"
        >
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              System Modules
            </p>
            <h2 id="features-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Tools designed for the modern hiring workflow
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Each module tackles a specific friction point in technical hiring, from ATS parsing and skill gap evaluation to active interview tracking.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="group flex flex-col justify-between bg-[#0f0f12] p-6 transition-colors hover:bg-[#141418]"
              >
                <div>
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-300 group-hover:border-emerald-500/30 group-hover:text-emerald-400">
                    <feature.icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => navigate(feature.path)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section
          id="architecture"
          aria-labelledby="architecture-title"
          className="border-t border-white/[0.06] bg-[#0c0c0e] py-20"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                System Design
              </p>
              <h2 id="architecture-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Architecture & Technical Foundations
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Built as a lightweight, modular system capable of running completely local on your machine or deployed with serverless cloud infrastructure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-5 shadow-sm"
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <item.icon size={16} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Architecture Details Box */}
            <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Layers size={15} className="text-emerald-400" />
                <span>Data Flow & Verification Pipeline</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3 text-xs text-zinc-400">
                <div>
                  <p className="font-semibold text-zinc-200">1. Ingestion & Normalization</p>
                  <p className="mt-1 leading-relaxed">
                    Resumes are extracted using PyMuPDF and python-docx, tokenized, and mapped to standard taxonomy dictionaries for skills and qualifications.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">2. Vector & Rule Scoring</p>
                  <p className="mt-1 leading-relaxed">
                    Job postings are cross-analyzed against parsed candidate tokens to compute deterministic match percentages and pinpoint keyword gaps.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-zinc-200">3. Storage & Portability</p>
                  <p className="mt-1 leading-relaxed">
                    Relational storage through SQLAlchemy Async allows instant development with SQLite and production deployment on Neon PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About the Developer & Project Context */}
        <section
          id="about"
          aria-labelledby="about-title"
          className="mx-auto max-w-6xl border-t border-white/[0.06] px-6 py-20"
        >
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Developer Background
              </p>
              <h2 id="about-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                About the Project
              </h2>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Career Companion was conceptualized and developed by <strong className="text-zinc-200">Ninad Panchal</strong>,
                a final-year Bachelor of Engineering student specializing in Artificial Intelligence and Data Science in Bengaluru, India.
              </p>

              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0f0f12] p-4 text-xs text-zinc-300">
                <div className="flex items-center gap-2.5 font-medium text-zinc-200">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Ninad Panchal</p>
                    <p className="text-[11px] text-zinc-400">B.E. AI & Data Science Candidate • Bengaluru</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-zinc-400 leading-relaxed">
                  Focus: Machine Learning Systems, Full-Stack Python/TypeScript, and Developer Tooling.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-sm text-zinc-400 leading-relaxed">
              <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6">
                <h3 className="text-sm font-semibold text-zinc-200">Why I Built This</h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  While applying for software engineering and AI/DS roles during placements, I found existing solutions either overly complex, locked behind paywalls, or cluttered with AI marketing buzzwords. Most applicants resort to fragmented spreadsheets and guesswork about ATS requirements.
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Career Companion was created as an honest, utilitarian alternative: a tool that runs locally, respects candidate privacy, provides concrete bullet point guidance using industry standards, and keeps your entire application pipeline structured under one unified interface.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-6">
                <h3 className="text-sm font-semibold text-zinc-200">Design Principles</h3>
                <ul className="mt-2 space-y-2 text-xs text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>Data Sovereignty:</strong> Your resumes, notes, and tracking metrics stay on your own machine or private database.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>No Paywalls or Lock-in:</strong> 100% open-source core built with standard tools (FastAPI, React, PostgreSQL).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>Practical Heuristics:</strong> Algorithms that function deterministically even without an external LLM subscription.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Links Section */}
        <section
          id="contact"
          aria-labelledby="contact-title"
          className="border-t border-white/[0.06] bg-[#0c0c0e] py-20"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Connect & Feedback
            </p>
            <h2 id="contact-title" className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Source code, discussions, and contact
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
              Whether you are an engineering student, recruiter, or fellow developer, feel free to inspect the codebase or connect.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              <a
                href="https://github.com/NinadPanchal/Career-Companion"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/[0.08] bg-[#0f0f12] p-5 transition-colors hover:border-white/[0.18] hover:bg-[#141418]"
              >
                <div className="flex items-center justify-between">
                  <GithubIcon width={18} height={18} className="text-zinc-400 group-hover:text-white" />
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">GitHub Repository</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Inspect the source code, open issues, or submit pull requests.
                </p>
              </a>

              <a
                href="https://linkedin.com/in/ninadpanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-white/[0.08] bg-[#0f0f12] p-5 transition-colors hover:border-white/[0.18] hover:bg-[#141418]"
              >
                <div className="flex items-center justify-between">
                  <LinkedinIcon width={18} height={18} className="text-zinc-400 group-hover:text-white" />
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">LinkedIn Profile</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Connect for software engineering and AI/DS opportunities.
                </p>
              </a>

              <a
                href="mailto:local@career-companion.app"
                className="group rounded-xl border border-white/[0.08] bg-[#0f0f12] p-5 transition-colors hover:border-white/[0.18] hover:bg-[#141418]"
              >
                <div className="flex items-center justify-between">
                  <Mail size={18} className="text-zinc-400 group-hover:text-white" />
                  <ArrowRight size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200">Direct Contact</h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Send inquiries, bug reports, or feature requests directly.
                </p>
              </a>
            </div>

            {/* Launch CTA */}
            <div className="mt-12">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
              >
                <span>Launch Career Companion App</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-white/[0.08] bg-[#09090b] px-6 py-8 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
              CC
            </span>
            <span>Career Companion • Developed by Ninad Panchal</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#hero" className="hover:text-zinc-300 transition-colors">Back to Top</a>
            <span>•</span>
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <span>•</span>
            <a href="#architecture" className="hover:text-zinc-300 transition-colors">Architecture</a>
            <span>•</span>
            <a href="#about" className="hover:text-zinc-300 transition-colors">About</a>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
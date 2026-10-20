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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../components/ui/Icons";
import { SpecularButton } from "../../components/ui/SpecularButton";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: "resume-ats",
      icon: FileText,
      title: "Resume ATS & XYZ Rewriter",
      path: "/resume",
      badge: "Core Scanner",
      description:
        "Extracts and analyzes PDF & DOCX resumes into structured schema. Evaluates accomplishment metrics using Google's XYZ formula with deterministic rubrics.",
      actionText: "Open Resume Scanner",
    },
    {
      id: "skill-matching",
      icon: Target,
      title: "Deterministic Skill Gap Engine",
      path: "/jobs",
      badge: "High Signal",
      description:
        "Vectorized keyword matching against real-world engineering requisitions. Pinpoint high-priority missing technical proficiencies with exact match percentages.",
      actionText: "Explore Match Scores",
    },
    {
      id: "job-discovery",
      icon: Search,
      title: "Curated Tech Job Discovery",
      path: "/jobs",
      badge: "Aggregator",
      description:
        "Directly discover developer and AI/DS roles across major tech hubs (Bengaluru, Pune, Hyderabad, NCR) and verified remote engineering teams.",
      actionText: "Search Curated Jobs",
    },
    {
      id: "pipeline-tracking",
      icon: Kanban,
      title: "Clean Kanban Pipeline",
      path: "/applications",
      badge: "Zero Friction",
      description:
        "Full application lifecycle tracking across 5 distinct stages with instant salary insights, interview milestones, and linked preparation notes.",
      actionText: "Open Kanban Board",
    },
    {
      id: "outreach-generation",
      icon: Send,
      title: "Executive Outreach Studio",
      path: "/cover-letter",
      badge: "Tailored Copy",
      description:
        "Generates concise, recruiter-grade cover letters and referral pitches with real-time markdown export and zero generic placeholder filler.",
      actionText: "Draft Outreach",
    },
    {
      id: "interview-prep",
      icon: Bot,
      title: "STAR Interview Simulator",
      path: "/interview-prep",
      badge: "Live Zen Mode",
      description:
        "Simulate technical and behavioral interviews with real-time countdown timers, structured STAR prompts, and actionable scoring rubrics.",
      actionText: "Practice Interviews",
    },
  ];

  const techStack = [
    {
      icon: Terminal,
      title: "FastAPI Engine",
      tag: "Python 3.13",
      detail: "Ultra-fast async REST API with Pydantic v2 schemas and modular dependency-injected routers.",
    },
    {
      icon: Database,
      title: "Dual Database Architecture",
      tag: "PostgreSQL & SQLite",
      detail: "Zero-config local SQLite for private offline usage with seamless branching to cloud Neon Postgres.",
    },
    {
      icon: Code2,
      title: "React 19 & Tauri v2",
      tag: "Modern Frontend",
      detail: "Native desktop capability combined with Vite, Obsidian & Emerald design system, and Zustand state.",
    },
    {
      icon: Cpu,
      title: "Privacy-First Heuristics",
      tag: "Local AI Heuristics",
      detail: "Deterministic NLP keyword extractors that function 100% offline without requiring paid API tokens.",
    },
  ];

  return (
    <div className="landing-shell min-h-screen bg-[#07080a] text-[#fafafa] selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Header / Navigation Bar */}
      <header className="landing-nav sticky top-0 z-50 border-b border-white/[0.07] bg-[#07080a]/80 backdrop-blur-xl">
        <div className="landing-container flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
            aria-label="Career Companion Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-black text-xs text-[#07080a] shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/30">
              CC
            </span>
            <div className="flex flex-col">
              <span className="leading-tight font-bold">Career Companion</span>
              <span className="text-[10px] font-mono text-zinc-500">v2.1 • Local First</span>
            </div>
          </a>

          {/* Section Navigation Links */}
          <nav aria-label="Page Sections" className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
            <a href="#features" className="transition-colors hover:text-emerald-400">
              Capabilities
            </a>
            <a href="#architecture" className="transition-colors hover:text-emerald-400">
              Architecture
            </a>
            <a href="#about" className="transition-colors hover:text-emerald-400">
              Philosophy
            </a>
            <a href="#contact" className="transition-colors hover:text-emerald-400">
              Source & Connect
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/NinadPanchal/Career-Companion"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
              aria-label="GitHub Repository (opens in new tab)"
            >
              <GithubIcon width={14} height={14} />
              <span>Source</span>
            </a>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-1.5 text-xs font-semibold text-[#07080a] shadow-md shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_70%)] blur-3xl -z-10"
        />

        {/* Hero Section */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="landing-hero landing-container text-center relative"
        >
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-xs text-emerald-300 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span className="font-medium">Quiet Luxury Engineering Workbench</span>
            <span className="text-emerald-500/40">•</span>
            <span className="text-zinc-400">Local-First & Zero Telemetry Clutter</span>
          </div>

          <h1
            id="hero-title"
            className="landing-title text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1]"
          >
            A high-signal workspace for your{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              technical job search
            </span>.
          </h1>

          <p className="landing-lead mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg sm:leading-relaxed">
            Eliminate chaotic spreadsheets and noisy AI gimmicks. Career Companion provides a unified, local-first workbench to audit resumes with Google XYZ rubrics, evaluate candidate skill gaps, and run clean pipeline tracking.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <SpecularButton
              onClick={() => navigate("/dashboard")}
              lineColor="#a7f3d0"
              baseColor="#059669"
              textColor="#022c22"
              radius={12}
              intensity={1.3}
              followMouse
              className="w-full sm:w-auto"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={18} />
            </SpecularButton>

            <SpecularButton
              onClick={() => navigate("/resume")}
              tint="#111318"
              tintOpacity={1}
              textColor="#fafafa"
              lineColor="#34d399"
              baseColor="#27272a"
              radius={12}
              intensity={1.05}
              followMouse
              className="w-full sm:w-auto"
            >
              <FileText size={18} />
              <span>ATS & Bullet Rewriter</span>
            </SpecularButton>

            <SpecularButton
              onClick={() => window.open("https://github.com/NinadPanchal/Career-Companion", "_blank", "noopener,noreferrer")}
              tint="#07080a"
              tintOpacity={1}
              textColor="#d4d4d8"
              lineColor="#a7f3d0"
              baseColor="#1f2937"
              radius={12}
              intensity={0.9}
              followMouse
              className="w-full sm:w-auto"
            >
              <GithubIcon width={17} height={17} />
              <span>View Code</span>
              <ExternalLink size={13} className="text-zinc-500" />
            </SpecularButton>
          </div>

          {/* Interactive Hero Preview */}
          <div className="hero-preview" aria-label="Career Companion workspace preview">
            <div className="hero-preview__topbar">
              <div className="hero-preview__dots"><i /><i /><i /></div>
              <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                <span>app.career-companion.local</span>
                <span className="text-zinc-600">/</span>
                <span className="text-emerald-400">dashboard</span>
              </span>
              <span className="hero-preview__sync">
                <i />Local DB Ready
              </span>
            </div>
            <div className="hero-preview__body">
              <div className="hero-preview__sidebar">
                <span className="hero-preview__brand">CC</span>
                <span className="is-active">Overview</span>
                <span onClick={() => navigate("/applications")}>Pipeline</span>
                <span onClick={() => navigate("/jobs")}>Job Board</span>
                <span onClick={() => navigate("/resume")}>Resume Studio</span>
                <span onClick={() => navigate("/interview-prep")}>Interview Prep</span>
              </div>
              <div className="hero-preview__content">
                <div className="hero-preview__headline">
                  <div>
                    <small>EXECUTIVE OVERVIEW</small>
                    <strong>Welcome back, Candidate.</strong>
                  </div>
                  <button type="button" onClick={() => navigate("/applications")}>
                    + Track Application
                  </button>
                </div>

                <div className="hero-preview__metrics">
                  <div>
                    <small>TOTAL TRACKED</small>
                    <strong>42</strong>
                    <em>Active in pipeline</em>
                  </div>
                  <div>
                    <small>INTERVIEWING</small>
                    <strong className="text-amber-400">5</strong>
                    <em className="amber">Next round: Tomorrow</em>
                  </div>
                  <div>
                    <small>ATS HEALTH</small>
                    <strong className="text-emerald-400">88%</strong>
                    <em>Google XYZ compliant</em>
                  </div>
                </div>

                {/* Pipeline mini-strip */}
                <div className="mt-4 p-3 rounded-xl border border-white/[0.06] bg-black/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    <span className="text-zinc-400">Wishlist (12)</span>
                  </div>
                  <ChevronRight size={13} className="text-zinc-600" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-zinc-400">Applied (18)</span>
                  </div>
                  <ChevronRight size={13} className="text-zinc-600" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="text-amber-300 font-semibold">Interview (5)</span>
                  </div>
                  <ChevronRight size={13} className="text-zinc-600" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Offer (2)</span>
                  </div>
                </div>

                {/* Mini jobs row */}
                <div className="hero-preview__jobs mt-4">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        S
                      </div>
                      <span className="text-xs font-medium text-zinc-200">Stripe • Senior Fullstack Engineer</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      94% match
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">
                        V
                      </div>
                      <span className="text-xs font-medium text-zinc-200">Vercel • Frontend Platform Engineer</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      89% match
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Technical Highlights Strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 border-t border-white/[0.06] pt-6 text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-emerald-400" /> Python FastAPI Asynchronous Core
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" /> 100% Private & Local-First
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" /> Deterministic Google XYZ Scoring
            </span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" /> Free & Open Source
            </span>
          </div>
        </section>

        {/* Core Modules Section */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="landing-section landing-container border-t border-white/[0.06]"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
              <Sparkles size={13} />
              <span>Modular Architecture</span>
            </div>
            <h2 id="features-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for high-performing technical candidates
            </h2>
            <p className="mt-2.5 max-w-2xl text-sm text-zinc-400 leading-relaxed">
              Every workflow is decoupled into high-focus workspaces without annoying paywalls, aggressive tracking, or meaningless simulated telemetry.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#0c0d12]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* Subtle top ambient line */}
                <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400">
                      <feature.icon size={20} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.05]">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05]">
                  <button
                    type="button"
                    onClick={() => navigate(feature.path)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 transition-colors group-hover:text-emerald-300"
                  >
                    <span>{feature.actionText}</span>
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
          className="landing-section landing-section--muted border-t border-white/[0.06] bg-[#07080a]"
        >
          <div className="landing-container">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
                <Layers size={13} />
                <span>System Design</span>
              </div>
              <h2 id="architecture-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Technical Foundations & Zero Compromises
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm text-zinc-400 leading-relaxed">
                Built with modern systems programming principles: fast startup times, complete offline autonomy, and instant scalability to serverless cloud branches.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-5 backdrop-blur-md shadow-sm transition-all hover:border-white/[0.15]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <item.icon size={17} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Architecture Details Box */}
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Layers size={16} className="text-emerald-400" />
                <span>Data Flow & Verification Pipeline</span>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-3 text-xs text-zinc-400">
                <div className="p-4 rounded-xl border border-white/[0.05] bg-black/30">
                  <p className="font-semibold text-zinc-200 text-sm">1. Extraction & Parsing</p>
                  <p className="mt-2 leading-relaxed">
                    Resumes are ingested natively using PyMuPDF and python-docx, tokenized into skills, certifications, and experience nodes via standard taxonomies.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.05] bg-black/30">
                  <p className="font-semibold text-zinc-200 text-sm">2. Deterministic Scoring</p>
                  <p className="mt-2 leading-relaxed">
                    Keyword distributions and Google XYZ action-verb rubrics evaluate accomplishment statements without relying on erratic hallucinated scores.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.05] bg-black/30">
                  <p className="font-semibold text-zinc-200 text-sm">3. Local & Cloud Storage</p>
                  <p className="mt-2 leading-relaxed">
                    SQLAlchemy 2.0 async engine supports zero-config local SQLite files for private development and Neon PostgreSQL for multi-device sync.
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
          className="landing-section landing-container border-t border-white/[0.06]"
        >
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
                <User size={13} />
                <span>Creator & Context</span>
              </div>
              <h2 id="about-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                About Career Companion
              </h2>
              <p className="mt-3.5 text-sm text-zinc-400 leading-relaxed">
                Career Companion was designed and developed by <strong className="text-zinc-200">Ninad Panchal</strong>,
                a final-year Bachelor of Engineering student specializing in Artificial Intelligence and Data Science in Mumbai, India.
              </p>

              <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-5 text-xs text-zinc-300 backdrop-blur-md">
                <div className="flex items-center gap-3 font-medium text-zinc-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Ninad Panchal</p>
                    <p className="text-xs text-zinc-400">B.E. AI & Data Science • Mumbai, India</p>
                  </div>
                </div>
                <p className="mt-3.5 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.05] pt-3">
                  Core competencies: Scalable Machine Learning Pipelines, Asynchronous Python/FastAPI, TypeScript / React 19 Frontend Engineering, and Developer Platforms.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-sm text-zinc-400 leading-relaxed">
              <div className="rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-zinc-200">Why This Project Exists</h3>
                <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
                  During campus and off-campus placements, existing career software was either predatory, locked behind recurring subscriptions, or crammed with fake AI buzzwords. Candidates deserve tools that respect their data, offer immediate offline feedback, and clarify the exact expectations of hiring teams.
                </p>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                  Career Companion was created as an honest, utilitarian alternative: a unified workspace that runs locally, respects candidate privacy, provides concrete bullet point guidance using industry standards, and keeps your entire application pipeline organized.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-6 backdrop-blur-md">
                <h3 className="text-sm font-semibold text-zinc-200">Core Engineering Principles</h3>
                <ul className="mt-3 space-y-2.5 text-xs text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>Data Sovereignty:</strong> Your resumes, job notes, and pipeline metrics stay on your local disk or private database.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>No Paywalls or Vendor Lock-in:</strong> 100% open-source core with standard industry frameworks (FastAPI, React, SQLite, Neon).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-emerald-400 shrink-0" />
                    <span><strong>Zero Simulated Noise:</strong> No fake telemetry counters, no artificial loading delays, and no fake cryptographic hashes.</span>
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
          className="landing-section landing-section--muted border-t border-white/[0.06] bg-[#07080a]"
        >
          <div className="landing-container landing-container--narrow text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400">
              <Mail size={13} />
              <span>Connect & Collaborate</span>
            </div>
            <h2 id="contact-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Source Code & Direct Contact
            </h2>
            <p className="mx-auto mt-2.5 max-w-xl text-sm text-zinc-400">
              Whether you are an engineering student, recruiter, or fellow developer, feel free to inspect the codebase or connect.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              <a
                href="https://github.com/NinadPanchal/Career-Companion"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-5 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-[#12141c]"
              >
                <div className="flex items-center justify-between">
                  <GithubIcon width={20} height={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  <ExternalLink size={13} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200 group-hover:text-white">GitHub Repository</h3>
                <p className="mt-1.5 text-xs text-zinc-400">
                  Inspect the source code, open issues, or star the project.
                </p>
              </a>

              <a
                href="https://linkedin.com/in/ninadpanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-5 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-[#12141c]"
              >
                <div className="flex items-center justify-between">
                  <LinkedinIcon width={20} height={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  <ExternalLink size={13} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200 group-hover:text-white">LinkedIn Profile</h3>
                <p className="mt-1.5 text-xs text-zinc-400">
                  Connect for software engineering and AI/DS opportunities.
                </p>
              </a>

              <a
                href="mailto:ninadpanchal@example.com"
                className="group rounded-2xl border border-white/[0.07] bg-[#0c0d12]/90 p-5 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-[#12141c]"
              >
                <div className="flex items-center justify-between">
                  <Mail size={20} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  <ArrowRight size={13} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-zinc-200 group-hover:text-white">Direct Email</h3>
                <p className="mt-1.5 text-xs text-zinc-400">
                  Send inquiries, bug reports, or architectural feedback.
                </p>
              </a>
            </div>

            {/* Launch CTA */}
            <div className="mt-12">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-7 py-3 text-sm font-semibold text-[#07080a] shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>Launch Career Companion App</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="landing-footer border-t border-white/[0.07] bg-[#07080a] text-xs text-zinc-500">
        <div className="landing-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
              CC
            </span>
            <span>Career Companion • Designed & Engineered by Ninad Panchal</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#hero" className="hover:text-zinc-300 transition-colors">Back to Top</a>
            <span>•</span>
            <a href="#features" className="hover:text-zinc-300 transition-colors">Capabilities</a>
            <span>•</span>
            <a href="#architecture" className="hover:text-zinc-300 transition-colors">Architecture</a>
            <span>•</span>
            <a href="#about" className="hover:text-zinc-300 transition-colors">Philosophy</a>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
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

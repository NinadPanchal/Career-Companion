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
import { Button } from "../../components/ui/Button";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
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
      detail: "Native desktop capability combined with Vite, Liquid Glass design tokens, and local offline fonts.",
    },
    {
      icon: Cpu,
      title: "Privacy-First Heuristics",
      tag: "Local AI Heuristics",
      detail: "Deterministic NLP keyword extractors that function 100% offline without requiring paid API tokens.",
    },
  ];

  return (
    <div className="landing-shell">
      {/* Top Header / Navigation Bar */}
      <header className="landing-nav">
        <div className="landing-container flex items-center justify-between">
          <a
            href="#hero"
            className="flex items-center gap-3 text-[var(--text-sm)] font-semibold tracking-tight text-[var(--text)] transition-opacity hover:opacity-90"
            aria-label="Career Companion Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] font-bold text-xs text-[var(--accent-contrast)] shadow-md">
              CC
            </span>
            <div className="flex flex-col">
              <span className="leading-tight font-semibold text-[var(--text)]">Career Companion</span>
              <span className="text-[10px] font-mono text-[var(--text-faint)]">v2.1 • Local First</span>
            </div>
          </a>

          {/* Section Navigation Links */}
          <nav aria-label="Page Sections" className="hidden md:flex items-center gap-7 text-[var(--text-xs)] font-medium text-[var(--text-muted)]">
            <a href="#features" className="transition-colors hover:text-[var(--text)]">
              Capabilities
            </a>
            <a href="#architecture" className="transition-colors hover:text-[var(--text)]">
              Architecture
            </a>
            <a href="#about" className="transition-colors hover:text-[var(--text)]">
              Philosophy
            </a>
            <a href="#contact" className="transition-colors hover:text-[var(--text)]">
              Source & Connect
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <a
              href="https://github.com/NinadPanchal/Career-Companion"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-[var(--text-xs)] font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--glass-bg-strong)] hover:text-[var(--text)]"
              aria-label="GitHub Repository (opens in new tab)"
            >
              <GithubIcon width={14} height={14} />
              <span>Source</span>
            </a>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Ambient Top Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[360px] bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)] blur-3xl -z-10"
        />

        {/* Hero Section */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="landing-hero landing-container text-center relative"
        >
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-[var(--text-xs)] text-[var(--text-muted)] shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
            <span className="font-medium text-[var(--text)]">Quiet Luxury Engineering Workbench</span>
            <span className="text-[var(--text-faint)]">•</span>
            <span>Local-First & Zero Telemetry Clutter</span>
          </div>

          <h1
            id="hero-title"
            className="landing-title text-4xl sm:text-6xl font-bold tracking-tight text-[var(--text)] leading-[1.08]"
          >
            A high-signal workspace for your{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_60%,white)] bg-clip-text text-transparent">
              technical job search
            </span>
            .
          </h1>

          <p className="landing-lead mx-auto mt-6 max-w-2xl text-[var(--text-md)] sm:text-[var(--text-lg)] text-[var(--text-muted)] leading-relaxed">
            Eliminate chaotic spreadsheets and noisy AI gimmicks. Career Companion provides a unified, local-first workbench to audit resumes with Google XYZ rubrics, evaluate candidate skill gaps, and run clean pipeline tracking.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto gap-2"
            >
              <span>Open Dashboard</span>
              <ArrowRight size={16} />
            </Button>

            <Button
              variant="glass"
              size="lg"
              onClick={() => navigate("/resume")}
              className="w-full sm:w-auto gap-2"
            >
              <FileText size={16} />
              <span>ATS & Bullet Rewriter</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open("https://github.com/NinadPanchal/Career-Companion", "_blank", "noopener,noreferrer")}
              className="w-full sm:w-auto gap-2"
            >
              <GithubIcon width={16} height={16} />
              <span>View Code</span>
              <ExternalLink size={12} className="text-[var(--text-muted)]" />
            </Button>
          </div>

          {/* Interactive Hero Preview */}
          <div className="hero-preview" aria-label="Career Companion workspace preview">
            <div className="hero-preview__topbar">
              <div className="hero-preview__dots"><i /><i /><i /></div>
              <span className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-[11px]">
                <span>app.career-companion.local</span>
                <span className="text-[var(--text-faint)]">/</span>
                <span className="text-[var(--accent)]">dashboard</span>
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
                    <strong className="text-[var(--warning)]">5</strong>
                    <em>Next round: Tomorrow</em>
                  </div>
                  <div>
                    <small>ATS HEALTH</small>
                    <strong className="text-[var(--success)]">88%</strong>
                    <em>Google XYZ compliant</em>
                  </div>
                </div>

                {/* Pipeline mini-strip */}
                <div className="mt-4 p-3 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--surface-solid)] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-faint)]" />
                    <span className="text-[var(--text-muted)]">Wishlist (12)</span>
                  </div>
                  <ChevronRight size={13} className="text-[var(--text-faint)]" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span className="text-[var(--text-muted)]">Applied (18)</span>
                  </div>
                  <ChevronRight size={13} className="text-[var(--text-faint)]" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
                    <span className="text-[var(--warning)] font-semibold">Interview (5)</span>
                  </div>
                  <ChevronRight size={13} className="text-[var(--text-faint)]" />
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    <span className="text-[var(--success)] font-semibold">Offer (2)</span>
                  </div>
                </div>

                {/* Mini jobs row */}
                <div className="hero-preview__jobs mt-4">
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                        S
                      </div>
                      <span className="text-xs font-medium text-[var(--text)]">Stripe • Senior Fullstack Engineer</span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-2 py-0.5 rounded-[var(--radius-sm)]">
                      94% match
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-solid)] border border-[var(--glass-border)]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                        V
                      </div>
                      <span className="text-xs font-medium text-[var(--text)]">Vercel • Frontend Platform Engineer</span>
                    </div>
                    <span className="text-xs font-semibold text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_12%,transparent)] px-2 py-0.5 rounded-[var(--radius-sm)]">
                      89% match
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Technical Highlights Strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 border-t border-[var(--divider)] pt-6 text-[var(--text-xs)] text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-[var(--accent)]" /> Python FastAPI Asynchronous Core
            </span>
            <span className="hidden sm:inline text-[var(--text-faint)]">•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--success)]" /> 100% Private & Local-First
            </span>
            <span className="hidden sm:inline text-[var(--text-faint)]">•</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--accent)]" /> Deterministic Google XYZ Scoring
            </span>
            <span className="hidden sm:inline text-[var(--text-faint)]">•</span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--warning)]" /> Free & Open Source
            </span>
          </div>
        </section>

        {/* Core Modules Section */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="landing-section landing-container border-t border-[var(--divider)]"
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--accent)]">
              <Sparkles size={13} />
              <span>Modular Architecture</span>
            </div>
            <h2 id="features-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
              Engineered for high-performing technical candidates
            </h2>
            <p className="mt-2.5 max-w-2xl text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
              Every workflow is decoupled into high-focus workspaces without annoying paywalls, aggressive tracking, or meaningless simulated telemetry.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.id}
                className="group relative flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-md transition-all duration-[var(--dur-base)] hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-[var(--glass-shadow)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--surface-solid)] text-[var(--accent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]">
                      <feature.icon size={20} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--text-muted)] bg-[var(--surface-solid)] px-2.5 py-1 rounded-[var(--radius-pill)] border border-[var(--glass-border)]">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-[var(--text-md)] font-semibold text-[var(--text)]">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-[var(--text-xs)] leading-relaxed text-[var(--text-muted)]">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--divider)]">
                  <button
                    type="button"
                    onClick={() => navigate(feature.path)}
                    className="inline-flex items-center gap-1.5 text-[var(--text-xs)] font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] cursor-pointer"
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
          className="landing-section landing-section--muted border-t border-[var(--divider)]"
        >
          <div className="landing-container">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--accent)]">
                <Layers size={13} />
                <span>System Design</span>
              </div>
              <h2 id="architecture-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
                Technical Foundations & Zero Compromises
              </h2>
              <p className="mt-2.5 max-w-2xl text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
                Built with modern systems programming principles: fast startup times, complete offline autonomy, and instant scalability to serverless cloud branches.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techStack.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-md shadow-sm transition-all hover:border-[var(--accent)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)]">
                      <item.icon size={17} strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-solid)] px-2 py-0.5 rounded-[var(--radius-sm)] border border-[var(--glass-border)]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">{item.title}</h3>
                  <p className="mt-2 text-[var(--text-xs)] leading-relaxed text-[var(--text-muted)]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Architecture Details Box */}
            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--surface-solid)] p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--text-xs)] font-semibold text-[var(--text)]">
                <Layers size={16} className="text-[var(--accent)]" />
                <span>Data Flow & Verification Pipeline</span>
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-3 text-[var(--text-xs)] text-[var(--text-muted)]">
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                  <p className="font-semibold text-[var(--text)] text-[var(--text-sm)]">1. Extraction & Parsing</p>
                  <p className="mt-2 leading-relaxed">
                    Resumes are ingested natively using PyMuPDF and python-docx, tokenized into skills, certifications, and experience nodes via standard taxonomies.
                  </p>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                  <p className="font-semibold text-[var(--text)] text-[var(--text-sm)]">2. Deterministic Scoring</p>
                  <p className="mt-2 leading-relaxed">
                    Keyword distributions and Google XYZ action-verb rubrics evaluate accomplishment statements without relying on erratic hallucinated scores.
                  </p>
                </div>
                <div className="p-4 rounded-[var(--radius-md)] border border-[var(--glass-border)] bg-[var(--glass-bg)]">
                  <p className="font-semibold text-[var(--text)] text-[var(--text-sm)]">3. Local & Cloud Storage</p>
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
          className="landing-section landing-container border-t border-[var(--divider)]"
        >
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--accent)]">
                <User size={13} />
                <span>Creator & Context</span>
              </div>
              <h2 id="about-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
                About Career Companion
              </h2>
              <p className="mt-3.5 text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
                Career Companion was designed and developed by <strong className="text-[var(--text)]">Ninad Panchal</strong>,
                a final-year Bachelor of Engineering student specializing in Artificial Intelligence and Data Science in Mumbai, India.
              </p>

              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--surface-solid)] p-5 text-xs text-[var(--text)]">
                <div className="flex items-center gap-3 font-medium text-[var(--text)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)]">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[var(--text-sm)] font-semibold text-[var(--text)]">Ninad Panchal</p>
                    <p className="text-[var(--text-xs)] text-[var(--text-muted)]">B.E. AI & Data Science • Mumbai, India</p>
                  </div>
                </div>
                <p className="mt-3.5 text-[var(--text-xs)] text-[var(--text-muted)] leading-relaxed border-t border-[var(--divider)] pt-3">
                  Core competencies: Scalable Machine Learning Pipelines, Asynchronous Python/FastAPI, TypeScript / React 19 Frontend Engineering, and Developer Platforms.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4 text-[var(--text-sm)] text-[var(--text-muted)] leading-relaxed">
              <div className="rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-md">
                <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">Why This Project Exists</h3>
                <p className="mt-2.5 text-[var(--text-xs)] text-[var(--text-muted)] leading-relaxed">
                  During campus and off-campus placements, existing career software was either predatory, locked behind recurring subscriptions, or crammed with fake AI buzzwords. Candidates deserve tools that respect their data, offer immediate offline feedback, and clarify the exact expectations of hiring teams.
                </p>
                <p className="mt-2 text-[var(--text-xs)] text-[var(--text-muted)] leading-relaxed">
                  Career Companion was created as an honest, utilitarian alternative: a unified workspace that runs locally, respects candidate privacy, provides concrete bullet point guidance using industry standards, and keeps your entire application pipeline organized.
                </p>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6 backdrop-blur-md">
                <h3 className="text-[var(--text-sm)] font-semibold text-[var(--text)]">Core Engineering Principles</h3>
                <ul className="mt-3 space-y-2.5 text-[var(--text-xs)] text-[var(--text-muted)]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-[var(--success)] shrink-0" />
                    <span><strong className="text-[var(--text)]">Data Sovereignty:</strong> Your resumes, job notes, and pipeline metrics stay on your local disk or private database.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-[var(--success)] shrink-0" />
                    <span><strong className="text-[var(--text)]">No Paywalls or Vendor Lock-in:</strong> 100% open-source core with standard industry frameworks (FastAPI, React, SQLite, Neon).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="mt-0.5 text-[var(--success)] shrink-0" />
                    <span><strong className="text-[var(--text)]">Zero Simulated Noise:</strong> No fake telemetry counters, no artificial loading delays, and no fake cryptographic hashes.</span>
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
          className="landing-section landing-section--muted border-t border-[var(--divider)]"
        >
          <div className="landing-container landing-container--narrow text-center">
            <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1 text-[var(--text-xs)] font-medium text-[var(--accent)]">
              <Mail size={13} />
              <span>Connect & Collaborate</span>
            </div>
            <h2 id="contact-title" className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
              Source Code & Direct Contact
            </h2>
            <p className="mx-auto mt-2.5 max-w-xl text-[var(--text-sm)] text-[var(--text-muted)]">
              Whether you are an engineering student, recruiter, or fellow developer, feel free to inspect the codebase or connect.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              <a
                href="https://github.com/NinadPanchal/Career-Companion"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-md transition-all hover:border-[var(--accent)] hover:bg-[var(--glass-bg-strong)]"
              >
                <div className="flex items-center justify-between">
                  <GithubIcon width={20} height={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <ExternalLink size={13} className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)]" />
                </div>
                <h3 className="mt-3 text-[var(--text-sm)] font-semibold text-[var(--text)]">GitHub Repository</h3>
                <p className="mt-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
                  Inspect the source code, open issues, or star the project.
                </p>
              </a>

              <a
                href="https://linkedin.com/in/ninadpanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-md transition-all hover:border-[var(--accent)] hover:bg-[var(--glass-bg-strong)]"
              >
                <div className="flex items-center justify-between">
                  <LinkedinIcon width={20} height={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <ExternalLink size={13} className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)]" />
                </div>
                <h3 className="mt-3 text-[var(--text-sm)] font-semibold text-[var(--text)]">LinkedIn Profile</h3>
                <p className="mt-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
                  Connect for software engineering and AI/DS opportunities.
                </p>
              </a>

              <a
                href="mailto:ninadpanchal@example.com"
                className="group rounded-[var(--radius-lg)] border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5 backdrop-blur-md transition-all hover:border-[var(--accent)] hover:bg-[var(--glass-bg-strong)]"
              >
                <div className="flex items-center justify-between">
                  <Mail size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                  <ArrowRight size={13} className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)]" />
                </div>
                <h3 className="mt-3 text-[var(--text-sm)] font-semibold text-[var(--text)]">Direct Email</h3>
                <p className="mt-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
                  Send inquiries, bug reports, or architectural feedback.
                </p>
              </a>
            </div>

            {/* Launch CTA */}
            <div className="mt-12">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="gap-2.5 px-8"
              >
                <span>Launch Career Companion App</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="landing-footer">
        <div className="landing-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-[10px] font-bold text-[var(--accent)]">
              CC
            </span>
            <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
              Career Companion • Designed & Engineered by Ninad Panchal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[var(--text-xs)] text-[var(--text-muted)]">
            <a href="#hero" className="hover:text-[var(--text)] transition-colors">Back to Top</a>
            <span>•</span>
            <a href="#features" className="hover:text-[var(--text)] transition-colors">Capabilities</a>
            <span>•</span>
            <a href="#architecture" className="hover:text-[var(--text)] transition-colors">Architecture</a>
            <span>•</span>
            <a href="#about" className="hover:text-[var(--text)] transition-colors">Philosophy</a>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors cursor-pointer"
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

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Search, 
  Target, 
  ShieldCheck, 
  Cpu, 
  Kanban, 
  Send, 
  Bot 
} from "lucide-react";
import { Button } from "../../components/ui/Button";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto bg-zinc-950 px-6 py-12 text-white">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px]" />

            <motion.div 
                className="relative z-10 my-auto max-w-5xl text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-md">
                    <Sparkles size={14} /> AI-Powered Career Operating System
                </div>

                <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                    Land Your Next Role with{" "}
                    <span className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent pb-1">
                        AI Precision
                    </span>
                </h1>

                <p className="mx-auto mb-8 max-w-2xl text-base text-zinc-400 sm:text-lg">
                    Career Companion parses your resume, matches skills against live tech market openings, crafts custom cover letters, coaches you through mock interviews, and tracks your pipeline from discovery to offer.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button 
                        size="lg" 
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        Launch App Dashboard <ArrowRight size={18} />
                    </Button>

                    <Button 
                        variant="secondary" 
                        size="lg" 
                        onClick={() => navigate("/resume")}
                        className="flex items-center gap-2"
                    >
                        <FileText size={18} /> Resume & ATS Scanner
                    </Button>
                </div>

                {/* 6-Pillar Feature Grid */}
                <motion.div 
                    className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                            <Cpu size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">Local Resume & ATS Engine</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Parse PDF/DOCX resumes and rewrite weak bullets using Google XYZ accomplishment formulas.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-blue-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                            <Target size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">Skill Match Analytics</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Percentage match scores, highlighted skill overlaps, and instant gap recommendations.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-purple-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                            <Search size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">Smart Job Discovery</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Discover Indian tech hubs (Bengaluru, Hyderabad, NCR) & global remote opportunities.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
                            <Kanban size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">Application Pipeline</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Kanban board to manage active interviews, salary offers, notes, and recruitment stages.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-pink-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
                            <Send size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">AI Cover Letter & Outreach</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Generate targeted cover letters, LinkedIn referral messages, and cold hiring manager emails.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                            <Bot size={20} />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-white">Mock Interview Coach</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Practice behavioral (STAR) and technical questions with real-time scoring and model answers.</p>
                    </div>
                </motion.div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> 100% Privacy Focused</span>
                    <span>•</span>
                    <span>Cross-Platform Web & Desktop</span>
                    <span>•</span>
                    <span>FastAPI & SQLite Architecture</span>
                </div>
            </motion.div>
        </main>
    );
};

export default LandingPage;
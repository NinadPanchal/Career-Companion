import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FileText, Search, Target, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "../../components/ui/Button";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-y-auto bg-zinc-950 px-6 py-10 text-white">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[140px]" />

            <motion.div 
                className="relative z-10 my-auto max-w-4xl text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 backdrop-blur-md">
                    <Sparkles size={14} /> Powered by Tauri v2 & Local AI Parsing
                </div>

                <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
                    Supercharge Your Career with{" "}
                    <span className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent pb-1">
                        AI Precision
                    </span>
                </h1>

                <p className="mx-auto mb-8 max-w-2xl text-base text-zinc-400 sm:text-lg">
                    Career Companion parses your resume, matches your core skills against live job market descriptions, and streamlines your application workflow — all stored securely on your machine.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button 
                        size="lg" 
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        Launch Dashboard <ArrowRight size={18} />
                    </Button>

                    <Button 
                        variant="secondary" 
                        size="lg" 
                        onClick={() => navigate("/resume")}
                        className="flex items-center gap-2"
                    >
                        <FileText size={18} /> Upload Resume First
                    </Button>
                </div>

                {/* Feature Grid */}
                <motion.div 
                    className="mt-10 grid gap-5 sm:grid-cols-3 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                            <Cpu size={22} />
                        </div>
                        <h3 className="mb-1.5 text-base font-bold text-white">Local Resume Parsing</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Extract sections and skills instantly from PDF and DOCX files securely on your device.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                            <Target size={22} />
                        </div>
                        <h3 className="mb-1.5 text-base font-bold text-white">Skill Match Analytics</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Instantly see percentage match scores, highlighted skill overlaps, and missing requirements.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-zinc-900/90">
                        <div className="mb-3 inline-block rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                            <Search size={22} />
                        </div>
                        <h3 className="mb-1.5 text-base font-bold text-white">Smart Job Discovery</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">Discover target engineering, product, and data roles aligned with your career trajectory.</p>
                    </div>
                </motion.div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> 100% Privacy Focused</span>
                    <span>•</span>
                    <span>Tauri v2 Desktop Engine</span>
                    <span>•</span>
                    <span>FastAPI SQLite Local Sync</span>
                </div>
            </motion.div>
        </main>
    );
};

export default LandingPage;
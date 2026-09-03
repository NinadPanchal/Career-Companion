import { Sparkles, FileCheck } from "lucide-react";
import { Card } from "../../components/ui/Cards";
import ResumeUpload from "../../features/resume/components/ResumeUploader";

function Resume() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={14} /> Resume Intelligence
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Resume Manager</h1>
        <p className="mt-1 text-zinc-400">
          Upload, analyze, and optimize your resume using local AI parsing.
        </p>
      </div>

      <Card className="max-w-5xl border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <FileCheck className="text-emerald-400" size={24} />
          <div>
            <h2 className="text-xl font-bold">Upload & Parse Document</h2>
            <p className="text-xs text-zinc-400">Supports PDF and Word (.docx) formats up to 10MB</p>
          </div>
        </div>

        <ResumeUpload />
      </Card>
    </main>
  );
}

export default Resume;
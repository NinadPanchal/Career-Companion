import { Card } from "../../components/ui/Cards";
import { Button } from "../../components/ui/Button";
import ResumeUpload from "../../features/resume/components/ResumeUploader";

function Resume() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-white">
      <Card hover className="max-w-4xl">
        <h1 className="text-4xl font-bold">Resume</h1>

        <p className="mt-2 text-zinc-400">
          Upload and improve your resume with AI.
        </p>

        <ResumeUpload />

      </Card>
    </main>
  );
}

export default Resume;
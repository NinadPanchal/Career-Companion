import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { Collapsible } from "../../../components/ui/Collapsible";
import { resumeService } from "../services/resume.service";
import { type ResumeAnalysisResult, useResumeStore } from "../stores/resume.store";

export default function ResumeUploader() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { file, analysis, setFile, setAnalysis, clearResume } = useResumeStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
      setMessage("");
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
  });

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus("uploading");
    setMessage("");

    try {
      const response = await resumeService.uploadResume(file) as ResumeAnalysisResult;
      setStatus("success");
      setMessage(response.message);
      setAnalysis(response);
    } catch (error) {
      setStatus("error");
      setMessage("We couldn't upload your resume. Make sure the API is running, then try again.");
    }
  };

  return (
    <div className="mt-8">
      <div
        {...getRootProps()}
        className={`
          cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200
          ${
            isDragActive
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-zinc-700 hover:border-emerald-500 hover:bg-zinc-900"
          }
        `}
      >
        <input {...getInputProps()} />

        <UploadCloud className="mx-auto mb-4 h-12 w-12 text-emerald-500" />

        <h2 className="text-2xl font-semibold">
          {isDragActive
            ? "Drop your resume here"
            : "Drag & Drop Resume"}
        </h2>

        <p className="mt-2 text-zinc-400">
          PDF or DOCX • Click to browse
        </p>
      </div>

      {file && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-emerald-500" />

            <div>
              <p className="font-medium">{file.name}</p>

              <p className="text-sm text-zinc-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAnalyze}
              disabled={status === "uploading"}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              {status === "uploading" ? "Uploading…" : "Analyze Resume"}
            </button>

            <button
              onClick={() => {
                setPreviewUrl("");
                setStatus("idle");
                setMessage("");
                clearResume();
              }}
              className="rounded-lg p-2 transition hover:bg-zinc-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
            status === "success"
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-red-500/10 text-red-300"
          }`}
        >
          {status === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      {analysis && (
        <Collapsible
          className="mt-6"
          title={`Extracted text · ${analysis.word_count} words`}
          icon={<FileText className="h-5 w-5 text-emerald-500" />}
          defaultOpen
        >
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {analysis.text_preview}
            {analysis.text_preview.length === 500 ? "…" : ""}
          </p>
        </Collapsible>
      )}

      {analysis && Object.keys(analysis.sections).length > 0 && (
        <Collapsible
          className="mt-6"
          title={`Detected sections · ${Object.keys(analysis.sections).length}`}
          icon={<FileText className="h-5 w-5 text-emerald-500" />}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(analysis.sections).map(([section, content]) => (
              <div key={section} className="rounded-lg bg-zinc-950 p-4">
                <h3 className="text-sm font-semibold capitalize text-emerald-300">
                  {section}
                </h3>
                <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                  {content}
                </p>
              </div>
            ))}
          </div>
        </Collapsible>
      )}

      {analysis && analysis.skills.length > 0 && (
        <Collapsible
          className="mt-6"
          title={`Detected skills · ${analysis.skills.length}`}
          icon={<FileText className="h-5 w-5 text-emerald-500" />}
          defaultOpen
        >
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </Collapsible>
      )}

      {file && (
        <Collapsible
          className="mt-6"
          title="Resume Preview"
          icon={<Eye className="h-5 w-5 text-emerald-500" />}
        >
          {file.type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              title="Resume Preview"
              className="h-[700px] w-full rounded-lg border border-zinc-800 bg-white"
            />
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-8 text-center">
              <FileText className="mx-auto mb-3 text-emerald-500" />
              <p className="font-medium">{file.name}</p>
              <p className="mt-2 text-sm text-zinc-400">
                DOCX preview isn't supported yet.
              </p>
              <p className="text-sm text-zinc-500">
                You'll still be able to upload and analyze this file.
              </p>
            </div>
          )}
        </Collapsible>
      )}
    </div>
  );
}

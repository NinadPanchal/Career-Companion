import { useCallback,useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X, Eye } from "lucide-react";
import { Collapsible } from "../../../components/ui/Collapsible";

export default function ResumeUploader() {
const [previewUrl, setPreviewUrl] = useState("");
const [file, setFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

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

          <button
            onClick={() => setFile(null)}
            className="rounded-lg p-2 transition hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>
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
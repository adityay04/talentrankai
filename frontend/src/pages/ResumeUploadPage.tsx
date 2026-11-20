import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  FileUp,
  LoaderCircle,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { getJob } from "../features/jobs/job.api";
import type { Job } from "../features/jobs/job.types";
import { uploadResumes } from "../features/candidates/candidates.api";
import type {
  BatchUploadResponse,
  CandidateUploadItem,
} from "../features/candidates/candidate.types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_BATCH_SIZE = 50;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ResumeUploadPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<BatchUploadResponse | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const numericJobId = Number(jobId);

  useEffect(() => {
    async function loadJob() {
      if (!Number.isInteger(numericJobId) || numericJobId <= 0) {
        setError("Invalid job ID.");
        setLoadingJob(false);
        return;
      }

      try {
        const data = await getJob(numericJobId);
        setJob(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load this job.",
        );
      } finally {
        setLoadingJob(false);
      }
    }

    void loadJob();
  }, [numericJobId]);

  const addFiles = useCallback(
    (incomingFiles: File[]) => {
      setError("");
      setResult(null);

      const messages: string[] = [];
      const accepted: File[] = [];

      for (const file of incomingFiles) {
        const extension = file.name
          .slice(file.name.lastIndexOf("."))
          .toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          messages.push(`${file.name}: Only PDF and DOCX files are supported.`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          messages.push(`${file.name}: File exceeds the 5 MB limit.`);
          continue;
        }

        if (file.size === 0) {
          messages.push(`${file.name}: File is empty.`);
          continue;
        }

        const duplicate = [...files, ...accepted].some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        );

        if (duplicate) {
          messages.push(`${file.name}: This file is already selected.`);
          continue;
        }

        accepted.push(file);
      }

      const remainingSlots = MAX_BATCH_SIZE - files.length;
      const filesToAdd = accepted.slice(0, remainingSlots);

      if (accepted.length > remainingSlots) {
        messages.push(`You can upload a maximum of ${MAX_BATCH_SIZE} files.`);
      }

      setFiles((current) => [...current, ...filesToAdd]);
      setValidationMessages(messages);
    },
    [files],
  );

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
    setResult(null);
  }

  async function handleUpload() {
    if (!files.length || !job) return;

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const response = await uploadResumes(job.id, files);
      setResult(response);
      setFiles([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to upload resumes.",
      );
    } finally {
      setUploading(false);
    }
  }

  if (loadingJob) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-muted">
        <LoaderCircle size={19} className="animate-spin" />
        Loading job details...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="px-6 py-16 md:px-10">
        <div className="surface-card mx-auto max-w-xl p-8">
          <p className="font-semibold">Unable to open this job</p>
          <p className="mt-2 text-sm text-danger">{error}</p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <ArrowLeft size={16} />
            Back to jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 md:px-10 md:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Back to jobs
        </Link>

        <Link
          to={`/jobs/${numericJobId}/ranking`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          View candidate ranking
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="mb-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Candidate intake · Job #{job.id}
        </p>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Bring your
              <br />
              <span className="text-muted">talent in.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-muted">
              Upload resumes for{" "}
              <strong className="text-ink">{job.title}</strong>. We'll extract
              candidate details and prepare them for matching.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white px-5 py-4">
            <p className="text-xs text-muted">Matching requirements</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.required_skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                >
                  {skill}
                </span>
              ))}
              {job.required_skills.length === 0 && (
                <span className="text-xs text-muted">
                  No required skills defined
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card p-6 md:p-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Resume ingestion
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              Upload resumes
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Select multiple files or drag them into the upload area.
            </p>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(Array.from(event.dataTransfer.files));
            }}
            className={`flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition ${
              dragging
                ? "border-accent bg-accent-soft"
                : "border-border bg-canvas hover:border-accent hover:bg-accent-soft/40"
            }`}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
              <UploadCloud size={25} />
            </div>

            <p className="font-display text-lg font-semibold">
              Drop your resumes here
            </p>

            <p className="mt-2 text-sm text-muted">or click to browse files</p>

            <span className="mt-5 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-muted">
              PDF and DOCX · Maximum 5 MB each
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="mt-7 flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Selected files ({files.length}/{MAX_BATCH_SIZE})
            </h4>

            {files.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setResult(null);
                }}
                className="text-xs font-medium text-muted transition hover:text-danger"
              >
                Clear all
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-canvas px-5 py-8 text-center">
              <FileUp size={22} className="mx-auto text-muted" />
              <p className="mt-3 text-sm text-muted">No files selected yet.</p>
            </div>
          ) : (
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {validationMessages.length > 0 && (
            <div className="mt-5 space-y-2 rounded-xl border border-warning/20 bg-warning/5 p-4">
              {validationMessages.map((message, index) => (
                <p key={index} className="text-xs leading-5 text-warning">
                  {message}
                </p>
              ))}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl bg-danger/5 p-4 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <div className="mt-7 border-t border-border pt-6">
            <button
              type="button"
              onClick={() => void handleUpload()}
              disabled={uploading || files.length === 0}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Processing resumes...
                </>
              ) : (
                <>
                  <UploadCloud size={17} />
                  Upload {files.length}{" "}
                  {files.length === 1 ? "resume" : "resumes"}
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-muted">
              Files are validated and parsed by your TalentRank backend.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Processing summary
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold">
              Parsing results
            </h3>
          </div>

          {!result ? (
            <div className="surface-card px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-canvas text-muted">
                <FileText size={21} />
              </div>
              <h4 className="mt-5 font-display text-lg font-semibold">
                Waiting for resumes
              </h4>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
                Once you upload files, candidate extraction results will appear
                here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="surface-card p-3">
                  <p className="text-xs text-muted">Total</p>
                  <p className="mt-2 font-display text-2xl font-semibold">
                    {result.total_files}
                  </p>
                </div>
                <div className="surface-card p-3">
                  <p className="text-xs text-muted">Successful</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-success">
                    {result.successful_uploads}
                  </p>
                </div>
                <div className="surface-card p-3">
                  <p className="text-xs text-muted">Failed</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-danger">
                    {result.failed_uploads}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.results.map((item: CandidateUploadItem, index) => (
                  <article
                    key={`${item.filename}-${index}`}
                    className="surface-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted">
                        <FileText size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-all text-sm font-semibold">
                          {item.filename}
                        </p>
                        <span
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            item.status === "success"
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {item.status === "success" ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          {item.status === "success" ? "Parsed" : "Failed"}
                        </span>

                        {item.status === "success" ? (
                          <div className="mt-3 space-y-1 text-xs text-muted">
                            <p className="font-medium text-ink">
                              {item.name || "Unknown candidate"}
                            </p>
                            <p>{item.email || "No email detected"}</p>
                            <p>{item.total_experience ?? 0} years experience</p>
                            <p>
                              {item.extracted_text_length ?? 0} characters
                              extracted
                            </p>
                          </div>
                        ) : (
                          <p className="mt-3 text-xs leading-5 text-danger">
                            {item.error || "Unable to parse this file."}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="surface-card p-5">
                <p className="text-sm font-semibold">
                  Resume processing complete
                </p>
                <p className="mt-2 text-xs leading-6 text-muted">
                  Your successfully parsed resumes are now saved. Run AI
                  matching to evaluate and rank these candidates against the job
                  requirements.
                </p>
                <Link
                  to={`/jobs/${numericJobId}/ranking`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
                >
                  View candidate ranking
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default ResumeUploadPage;

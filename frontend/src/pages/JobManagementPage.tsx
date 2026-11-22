import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  LoaderCircle,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { createJob, getJobs } from "../features/jobs/job.api";
import type { Job, JobCreatePayload } from "../features/jobs/job.types";

const initialForm = {
  title: "",
  description: "",
  requiredSkills: "",
  preferredSkills: "",
  minimumExperience: "0",
  qualifications: "",
};

function parseList(value: string): string[] {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function JobManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [jobsError, setJobsError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadJobs() {
    setLoadingJobs(true);
    setJobsError("");

    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      setJobsError(err instanceof Error ? err.message : "Unable to load jobs.");
    } finally {
      setLoadingJobs(false);
    }
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setFormError("");
    setSuccess("");

    const payload: JobCreatePayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      required_skills: parseList(form.requiredSkills),
      preferred_skills: parseList(form.preferredSkills),
      minimum_experience: Number(form.minimumExperience),
      qualifications: parseList(form.qualifications),
    };

    try {
      const createdJob = await createJob(payload);

      setJobs((current) => [createdJob, ...current]);

      setForm(initialForm);
      setSuccess(`"${createdJob.title}" was created successfully.`);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to create the job.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="px-6 py-10 md:px-10 md:py-14">
      <div className="mb-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Recruitment workspace
        </p>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Build your
              <br />
              <span className="text-muted">talent pipeline.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
              Define what you're looking for. TalentRank will use your job
              requirements to evaluate and rank incoming resumes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-success" />
            Connected to your workspace
          </div>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="surface-card p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                New opportunity
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Create a job
              </h3>
              <p className="mt-2 text-sm text-muted">
                Set up the role and its matching criteria.
              </p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <BriefcaseBusiness size={20} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="job-title"
                className="mb-2 block text-sm font-semibold"
              >
                Job title <span className="text-danger">*</span>
              </label>

              <input
                id="job-title"
                type="text"
                required
                minLength={2}
                maxLength={255}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="e.g. Backend Developer"
                className="h-12 w-full rounded-xl border border-border bg-canvas px-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="mb-2 block text-sm font-semibold"
              >
                Job description <span className="text-danger">*</span>
              </label>

              <textarea
                id="job-description"
                required
                minLength={20}
                rows={6}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the role, responsibilities, expectations, and what makes someone successful in this position..."
                className="w-full resize-y rounded-xl border border-border bg-canvas px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10"
              />

              <p className="mt-2 text-right text-xs text-muted">
                {form.description.length} characters · Minimum 20
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="required-skills"
                  className="mb-2 block text-sm font-semibold"
                >
                  Required skills
                </label>

                <textarea
                  id="required-skills"
                  rows={3}
                  value={form.requiredSkills}
                  onChange={(event) =>
                    updateField("requiredSkills", event.target.value)
                  }
                  placeholder="Python, FastAPI, PostgreSQL"
                  className="w-full resize-y rounded-xl border border-border bg-canvas px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />

                <p className="mt-2 text-xs text-muted">
                  Separate skills with commas.
                </p>
              </div>

              <div>
                <label
                  htmlFor="preferred-skills"
                  className="mb-2 block text-sm font-semibold"
                >
                  Preferred skills
                </label>

                <textarea
                  id="preferred-skills"
                  rows={3}
                  value={form.preferredSkills}
                  onChange={(event) =>
                    updateField("preferredSkills", event.target.value)
                  }
                  placeholder="Docker, AWS, Redis"
                  className="w-full resize-y rounded-xl border border-border bg-canvas px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10"
                />

                <p className="mt-2 text-xs text-muted">
                  Additional skills that strengthen a candidate.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="experience"
                className="mb-2 block text-sm font-semibold"
              >
                Minimum experience
              </label>

              <div className="relative">
                <Clock3
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  id="experience"
                  type="number"
                  min="0"
                  max="60"
                  step="0.5"
                  value={form.minimumExperience}
                  onChange={(event) =>
                    updateField("minimumExperience", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-border bg-canvas pl-11 pr-16 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
                  Years
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="qualifications"
                className="mb-2 block text-sm font-semibold"
              >
                Educational qualifications
              </label>

              <textarea
                id="qualifications"
                rows={2}
                value={form.qualifications}
                onChange={(event) =>
                  updateField("qualifications", event.target.value)
                }
                placeholder="B.Tech in Computer Science, MCA"
                className="w-full resize-y rounded-xl border border-border bg-canvas px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/10"
              />

              <p className="mt-2 text-xs text-muted">
                Separate qualifications with commas.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger"
              >
                <X size={17} className="mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4 text-sm text-success"
              >
                <Check size={17} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted">
                You can upload resumes after creating the job.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Create job
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Your opportunities
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Existing jobs
              </h3>
            </div>

            <button
              type="button"
              onClick={() => void loadJobs()}
              disabled={loadingJobs}
              aria-label="Refresh jobs"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted transition hover:bg-accent-soft hover:text-accent disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loadingJobs ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="space-y-3">
            {jobsError ? (
              <div
                role="alert"
                className="surface-card flex flex-col items-start gap-3 p-6 text-sm text-danger"
              >
                <p>{jobsError}</p>
                <button
                  type="button"
                  onClick={() => void loadJobs()}
                  disabled={loadingJobs}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-semibold text-ink transition hover:bg-accent-soft disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loadingJobs ? "animate-spin" : ""}
                  />
                  Try again
                </button>
              </div>
            ) : loadingJobs ? (
              <div className="surface-card flex min-h-48 items-center justify-center gap-3 text-sm text-muted">
                <LoaderCircle size={18} className="animate-spin" />
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="surface-card px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-canvas text-muted">
                  <BriefcaseBusiness size={21} />
                </div>
                <h4 className="mt-5 font-display text-lg font-semibold">
                  No jobs yet
                </h4>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">
                  Your created opportunities will appear here. Start by creating
                  your first job.
                </p>
              </div>
            ) : (
              jobs.map((job) => (
                <article
                  key={job.id}
                  className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                        Job #{job.id}
                      </p>
                      <h4 className="mt-2 break-words font-display text-lg font-semibold">
                        {job.title}
                      </h4>
                    </div>

                    <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-[10px] font-semibold text-success">
                      Created
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                    {job.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.required_skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                      >
                        {skill}
                      </span>
                    ))}

                    {job.required_skills.length > 4 && (
                      <span className="rounded-full bg-canvas px-3 py-1.5 text-xs text-muted">
                        +{job.required_skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted">
                      {job.minimum_experience} years minimum
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                      Saved
                      <Check size={14} className="text-success" />
                    </span>
                  </div>

                  <Link
                    to={`/jobs/${job.id}/candidates`}
                    style={{ color: "#ffffff" }}
                    className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-[#171717] px-4 text-sm font-semibold transition-all duration-300 hover:bg-[#2563eb]"
                  >
                    <span>Manage candidates</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default JobManagementPage;

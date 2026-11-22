import { useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileSearch,
  LoaderCircle,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getJobs } from "../features/jobs/job.api";
import {
  getCandidates,
  getMatchResults,
} from "../features/candidates/candidates.api";

interface DashboardStats {
  activeJobs: number;
  candidatesScreened: number;
  matchesGenerated: number;
}

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    candidatesScreened: 0,
    matchesGenerated: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const jobs = await getJobs();

      const jobData = await Promise.all(
        jobs.map(async (job) => {
          const [candidates, matches] = await Promise.all([
            getCandidates(job.id),
            getMatchResults(job.id),
          ]);

          return {
            candidates: candidates.length,
            matches: matches.length,
          };
        }),
      );

      const candidatesScreened = jobData.reduce(
        (total, job) => total + job.candidates,
        0,
      );

      const matchesGenerated = jobData.reduce(
        (total, job) => total + job.matches,
        0,
      );

      setStats({
        activeJobs: jobs.length,
        candidatesScreened,
        matchesGenerated,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dashboard data. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const hasJobs = stats.activeJobs > 0;

  return (
    <main className="px-6 py-10 md:px-10 md:py-14">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Recruiter workspace
          </div>

          <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            Find your next
            <br />
            <span className="text-muted">great hire.</span>
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted">
            Bring your candidates together, understand their strengths, and make
            better hiring decisions with AI-powered matching.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-full bg-[#2563eb] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] lg:self-auto"
        >
          <Plus size={17} />
          Create a job
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div
        className="my-12 grid gap-6 border-y border-border py-7 sm:grid-cols-3"
        aria-label="Recruitment statistics"
        aria-live="polite"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Active jobs</p>
            <p className="font-display text-xl font-semibold">
              {isLoading ? (
                <span className="text-muted">...</span>
              ) : (
                stats.activeJobs
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Candidates screened</p>
            <p className="font-display text-xl font-semibold">
              {isLoading ? (
                <span className="text-muted">...</span>
              ) : (
                stats.candidatesScreened
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <FileSearch size={20} />
          </div>
          <div>
            <p className="text-sm text-muted">Matches generated</p>
            <p className="font-display text-xl font-semibold">
              {isLoading ? (
                <span className="text-muted">...</span>
              ) : (
                stats.matchesGenerated
              )}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <section
          className="surface-card px-6 py-14 text-center md:px-12"
          role="alert"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
            <RefreshCw size={21} />
          </div>

          <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            We couldn't load your workspace.
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={isLoading}
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Try again
          </button>
        </section>
      ) : isLoading ? (
        <section
          className="surface-card flex flex-col items-center px-6 py-20 text-center md:px-12"
          aria-label="Loading workspace"
        >
          <LoaderCircle
            size={28}
            className="animate-spin text-accent"
            aria-hidden="true"
          />
          <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            Preparing your workspace.
          </h3>
          <p className="mt-3 text-sm text-muted">
            Gathering jobs, candidates, and matching results.
          </p>
        </section>
      ) : (
        <section className="surface-card relative overflow-hidden px-6 py-16 text-center md:px-12 md:py-24">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-accent-soft opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {hasJobs
                ? "Your recruitment workspace"
                : "Your workspace starts here"}
            </p>

            <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {hasJobs
                ? "Your next great hire starts with the right match."
                : "Your next great hire starts here."}
            </h3>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
              {hasJobs
                ? "Continue managing your jobs, upload resumes, and evaluate candidates based on skills, experience, and semantic relevance."
                : "Create your first job, upload resumes, and let TalentRank evaluate candidates based on skills, experience, and semantic relevance."}
            </p>

            <Link
              to="/jobs"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              <Plus size={17} />
              {hasJobs ? "Manage your jobs" : "Create your first job"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      )}

      <footer className="mt-10 flex flex-col justify-between gap-3 text-xs text-muted sm:flex-row">
        <span>TalentRank · Intelligent hiring, thoughtfully designed.</span>
        <span>AI-assisted candidate evaluation</span>
      </footer>
    </main>
  );
}

export default DashboardPage;

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CircleAlert,
  Clock3,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { getJob } from "../features/jobs/job.api";
import type { Job } from "../features/jobs/job.types";
import {
  getCandidates,
  getMatchResults,
  runMatching,
} from "../features/candidates/candidates.api";
import type {
  Candidate,
  MatchResult,
} from "../features/candidates/candidate.types";

function getScoreColor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-accent";
  return "text-muted";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent match";
  if (score >= 70) return "Strong match";
  if (score >= 50) return "Potential match";
  return "Low match";
}

function CandidateRankingPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = Number(jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    if (!Number.isInteger(numericJobId) || numericJobId <= 0) {
      setError("Invalid job ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const [jobData, candidateData] = await Promise.all([
        getJob(numericJobId),
        getCandidates(numericJobId),
      ]);

      setJob(jobData);
      setCandidates(candidateData);

      try {
        const matchData = await getMatchResults(numericJobId);
        setMatches(matchData);
      } catch {
        setMatches([]);
        setNotice(
          "Matching results could not be loaded. You can run matching again.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load candidate data.",
      );
    } finally {
      setLoading(false);
    }
  }, [numericJobId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const matchLookup = useMemo(
    () => new Map(matches.map((match) => [match.candidate_id, match])),
    [matches],
  );

  const evaluatedCount = matches.length;

  const filteredCandidates = useMemo(() => {
    return [...candidates]
      .filter((candidate) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          candidate.name.toLowerCase().includes(query) ||
          candidate.source_filename.toLowerCase().includes(query) ||
          (candidate.email || "").toLowerCase().includes(query);

        const match = matchLookup.get(candidate.id);

        const matchesFilter =
          filter === "all" ||
          (filter === "evaluated" && Boolean(match)) ||
          (filter === "unevaluated" && !match) ||
          (filter === "strong" && Boolean(match && match.overall_score >= 70));

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const scoreA = matchLookup.get(a.id)?.overall_score ?? -1;
        const scoreB = matchLookup.get(b.id)?.overall_score ?? -1;

        return scoreB - scoreA;
      });
  }, [candidates, filter, matchLookup, search]);

  const topMatch = matches.length
    ? [...matches].sort((a, b) => b.overall_score - a.overall_score)[0]
    : null;

  async function handleRunMatching() {
    if (!candidates.length) {
      setError("Upload resumes before running AI matching.");
      return;
    }

    setMatching(true);
    setError("");
    setNotice("");

    try {
      const results = await runMatching(numericJobId);
      setMatches(results);
      setNotice(`Successfully evaluated ${results.length} candidates.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI matching failed.");
    } finally {
      setMatching(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-muted">
        <LoaderCircle size={19} className="animate-spin" />
        Loading candidate intelligence...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="px-6 py-16 md:px-10">
        <div className="surface-card mx-auto max-w-xl p-8">
          <h2 className="font-display text-2xl font-semibold">
            Unable to load this job
          </h2>
          <p className="mt-3 text-sm text-danger">{error}</p>
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
          to={`/jobs/${numericJobId}/candidates`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Resume upload
        </Link>

        <button
          type="button"
          onClick={() => void loadData()}
          disabled={loading || matching}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-xs font-semibold text-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <section className="mb-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Candidate intelligence · Job #{job.id}
        </p>

        <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Find your
              <br />
              <span className="text-muted">best candidates.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
              Review your talent pool, compare candidate strengths, and discover
              the strongest matches for{" "}
              <strong className="text-ink">{job.title}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleRunMatching()}
            disabled={matching || candidates.length === 0}
            className="inline-flex h-13 shrink-0 items-center justify-center gap-3 rounded-full bg-[#171717] px-7 text-sm font-semibold text-white transition duration-300 hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {matching ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Evaluating candidates...
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                Run AI matching
                <ArrowUpRight size={16} />
              </>
            )}
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger"
        >
          <CircleAlert size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4 text-sm text-success"
        >
          <Check size={18} className="mt-0.5 shrink-0" />
          {notice}
        </div>
      )}

      <section className="mb-10 grid gap-3 border-y border-border py-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <Users size={19} />
          </div>
          <div>
            <p className="text-xs text-muted">Total candidates</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {candidates.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <Check size={19} />
          </div>
          <div>
            <p className="text-xs text-muted">Evaluated</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {evaluatedCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
            <Clock3 size={19} />
          </div>
          <div>
            <p className="text-xs text-muted">Awaiting evaluation</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {Math.max(candidates.length - evaluatedCount, 0)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Sparkles size={19} />
          </div>
          <div>
            <p className="text-xs text-muted">Top match</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
              {topMatch ? `${topMatch.overall_score.toFixed(1)}%` : "—"}
            </p>
          </div>
        </div>
      </section>

      {topMatch && (
        <section className="surface-card mb-10 overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-accent">
                Highest ranked candidate
              </p>

              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {topMatch.candidate_name}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {topMatch.email || "No email detected"}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {topMatch.matched_skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 md:gap-7">
              <div className="text-right">
                <p className="text-xs text-muted">Overall match</p>
                <p
                  className={`mt-1 font-display text-5xl font-semibold tracking-tight tabular-nums ${getScoreColor(topMatch.overall_score)}`}
                >
                  {topMatch.overall_score.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-muted">out of 100</p>
              </div>

              <Link
                to={`/jobs/${numericJobId}/candidates/${topMatch.candidate_id}`}
                aria-label={`View ${topMatch.candidate_name} profile`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#171717] text-white transition hover:bg-[#2563eb]"
              >
                <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Talent pool
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              All candidates
            </h3>
            <p className="mt-2 text-sm text-muted">
              Candidates are ranked by their overall matching score.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search candidates..."
                className="h-11 w-full rounded-full border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-accent sm:w-56"
              />
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="h-11 rounded-full border border-border bg-white px-4 text-sm outline-none focus:border-accent"
            >
              <option value="all">All candidates</option>
              <option value="evaluated">Evaluated</option>
              <option value="unevaluated">Not evaluated</option>
              <option value="strong">Strong matches (70+)</option>
            </select>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="surface-card px-6 py-16 text-center">
            <FileText size={27} className="mx-auto text-muted" />
            <h4 className="mt-5 font-display text-xl font-semibold">
              No candidates yet
            </h4>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
              Upload PDF or DOCX resumes to start building your candidate
              pipeline.
            </p>
            <Link
              to={`/jobs/${numericJobId}/candidates`}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
            >
              Upload resumes
              <ArrowUpRight size={15} />
            </Link>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="surface-card px-6 py-12 text-center">
            <p className="text-sm text-muted">
              No candidates match your current search or filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 text-sm font-semibold text-accent"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCandidates.map((candidate) => {
              const match = matchLookup.get(candidate.id);

              const rank = match
                ? matches.findIndex(
                    (item) => item.candidate_id === candidate.id,
                  ) + 1
                : null;

              return (
                <article
                  key={candidate.id}
                  className="surface-card p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md md:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-lg font-semibold text-accent">
                        {candidate.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {rank && (
                            <span className="text-xs font-semibold text-accent">
                              #{rank}
                            </span>
                          )}
                          <h4 className="font-display text-lg font-semibold">
                            {candidate.name}
                          </h4>
                          {match ? (
                            <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
                              Evaluated
                            </span>
                          ) : (
                            <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-semibold text-muted">
                              Not evaluated
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-all text-xs text-muted">
                          {candidate.email || candidate.source_filename}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {candidate.extracted_skills
                            .slice(0, 5)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-muted"
                              >
                                {skill}
                              </span>
                            ))}

                          {candidate.extracted_skills.length > 5 && (
                            <span className="px-1 py-1 text-[10px] text-muted">
                              +{candidate.extracted_skills.length - 5} more
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-muted">
                          {candidate.total_experience} years experience
                          <span className="mx-2">·</span>
                          {candidate.education.length} education entries
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-t border-border pt-4 lg:min-w-52 lg:justify-end lg:border-0 lg:pt-0">
                      {match ? (
                        <div className="text-left lg:text-right">
                          <p className="text-xs text-muted">
                            {getScoreLabel(match.overall_score)}
                          </p>
                          <p
                            className={`mt-1 font-display text-3xl font-semibold tabular-nums ${getScoreColor(match.overall_score)}`}
                          >
                            {match.overall_score.toFixed(1)}
                          </p>
                          <p className="text-[10px] text-muted">/ 100</p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted">
                          Awaiting AI evaluation
                        </p>
                      )}

                      <Link
                        to={`/jobs/${numericJobId}/candidates/${candidate.id}`}
                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition hover:border-accent hover:text-accent"
                      >
                        View profile
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {match && (
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 md:grid-cols-4">
                      <div>
                        <p className="text-[10px] text-muted">Semantic</p>
                        <p className="mt-1 text-sm font-semibold tabular-nums">
                          {match.semantic_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted">
                          Required skills
                        </p>
                        <p className="mt-1 text-sm font-semibold tabular-nums">
                          {match.required_skill_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted">Experience</p>
                        <p className="mt-1 text-sm font-semibold tabular-nums">
                          {match.experience_score.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted">
                          Preferred skills
                        </p>
                        <p className="mt-1 text-sm font-semibold tabular-nums">
                          {match.preferred_skill_score.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default CandidateRankingPage;

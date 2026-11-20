
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  GraduationCap,
  LoaderCircle,
  Mail,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { getJob } from "../features/jobs/job.api";
import type { Job } from "../features/jobs/job.types";
import {
  getCandidate,
  getMatchResults,
} from "../features/candidates/candidates.api";
import type {
  Candidate,
  MatchResult,
} from "../features/candidates/candidate.types";

const SKILL_ALIASES: Record<string, string> = {
  js: "javascript",
  ecmascript: "javascript",
  ts: "typescript",
  reactjs: "react",
  "react.js": "react",
  nextjs: "next.js",
  next: "next.js",
  nodejs: "node.js",
  node: "node.js",
  express: "express.js",
  expressjs: "express.js",
  postgres: "postgresql",
  postgre: "postgresql",
  mongo: "mongodb",
  "fast api": "fastapi",
  sklearn: "scikit-learn",
  "scikit learn": "scikit-learn",
  ml: "machine learning",
  dl: "deep learning",
  nlp: "natural language processing",
  "rest apis": "rest api",
  "restful api": "rest api",
  "restful apis": "rest api",
  aws: "amazon web services",
  gcp: "google cloud platform",
  "google cloud": "google cloud platform",
  azure: "microsoft azure",
  tailwind: "tailwind css",
  cpp: "c++",
  "c sharp": "c#",
};

function normalizeSkill(skill: string): string {
  const normalized = skill
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .replace(/\s+/g, " ");

  return SKILL_ALIASES[normalized] || normalized;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

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

function ScoreBar({
  label,
  score,
  description,
}: {
  label: string;
  score: number;
  description: string;
}) {
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
        <span className="font-display text-lg font-semibold tabular-nums">
          {score.toFixed(1)}%
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-canvas"
        role="progressbar"
        aria-label={label}
        aria-valuenow={safeScore}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}

function SkillGroup({
  title,
  skills,
  matchedSkills,
  emptyMessage,
}: {
  title: string;
  skills: string[];
  matchedSkills: Set<string>;
  emptyMessage: string;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        <span className="text-xs text-muted">{skills.length} skills</span>
      </div>

      {skills.length === 0 ? (
        <p className="rounded-xl bg-canvas px-4 py-3 text-xs text-muted">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const matched = matchedSkills.has(normalizeSkill(skill));

            return (
              <span
                key={skill}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ${
                  matched
                    ? "bg-success/10 text-success"
                    : "bg-danger/5 text-danger"
                }`}
              >
                {matched ? <Check size={13} /> : <X size={13} />}
                {skill}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CandidateProfilePage() {
  const { jobId, candidateId } = useParams<{
    jobId: string;
    candidateId: string;
  }>();

  const numericJobId = Number(jobId);
  const numericCandidateId = Number(candidateId);

  const [job, setJob] = useState<Job | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (
        !Number.isInteger(numericJobId) ||
        numericJobId <= 0 ||
        !Number.isInteger(numericCandidateId) ||
        numericCandidateId <= 0
      ) {
        setError("Invalid job or candidate ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [jobData, candidateData, matchData] = await Promise.all([
          getJob(numericJobId),
          getCandidate(numericJobId, numericCandidateId),
          getMatchResults(numericJobId),
        ]);

        if (!active) return;

        setJob(jobData);
        setCandidate(candidateData);
        setMatch(
          matchData.find(
            (item) => item.candidate_id === numericCandidateId,
          ) || null,
        );
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load candidate profile.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [numericJobId, numericCandidateId]);

  const matchedSkillSet = useMemo(
    () =>
      new Set(
        (match?.matched_skills || []).map((skill) =>
          normalizeSkill(skill),
        ),
      ),
    [match],
  );

  const requiredMatchedCount = useMemo(
    () =>
      job?.required_skills.filter((skill) =>
        matchedSkillSet.has(normalizeSkill(skill)),
      ).length || 0,
    [job, matchedSkillSet],
  );

  const preferredMatchedCount = useMemo(
    () =>
      job?.preferred_skills.filter((skill) =>
        matchedSkillSet.has(normalizeSkill(skill)),
      ).length || 0,
    [job, matchedSkillSet],
  );

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-muted">
        <LoaderCircle size={19} className="animate-spin" />
        Loading candidate profile...
      </main>
    );
  }

  if (error || !job || !candidate) {
    return (
      <main className="px-6 py-16 md:px-10">
        <div className="surface-card mx-auto max-w-xl p-8">
          <CircleAlert size={24} className="text-danger" />
          <h2 className="mt-5 font-display text-2xl font-semibold">
            Unable to load candidate
          </h2>
          <p className="mt-3 text-sm leading-6 text-danger">
            {error || "The requested candidate profile could not be found."}
          </p>
          <Link
            to={`/jobs/${numericJobId}/ranking`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent"
          >
            <ArrowLeft size={16} />
            Back to candidate ranking
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 md:px-10 md:py-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/jobs/${numericJobId}/ranking`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Candidate ranking
        </Link>

        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-muted">
          <BriefcaseBusiness size={14} />
          {job.title}
        </span>
      </div>

      <section className="mb-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Candidate intelligence · Profile #{candidate.id}
        </p>

        <div className="surface-card overflow-hidden">
          <div className="grid gap-8 p-6 md:p-9 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent-soft font-display text-2xl font-semibold text-accent">
                {getInitials(candidate.name)}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    {candidate.name}
                  </h1>
                  {match && (
                    <span className="rounded-full bg-success/10 px-3 py-1.5 text-[10px] font-semibold text-success">
                      Ranked #{match.rank}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-5">
                  <span className="inline-flex items-center gap-2 break-all">
                    <Mail size={15} />
                    {candidate.email || "No email detected"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness size={15} />
                    {candidate.total_experience} years experience
                  </span>
                </div>

                <p className="mt-4 inline-flex max-w-full items-center gap-2 break-all text-xs text-muted">
                  <FileText size={14} className="shrink-0" />
                  {candidate.source_filename}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6 xl:border-l xl:border-t-0 xl:pl-9 xl:pt-0">
              {match ? (
                <div className="flex items-center justify-between gap-8 xl:justify-end">
                  <div className="xl:text-right">
                    <p className="text-xs text-muted">Overall match</p>
                    <p
                      className={`mt-1 font-display text-5xl font-semibold tracking-tight tabular-nums ${getScoreColor(match.overall_score)}`}
                    >
                      {match.overall_score.toFixed(1)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {getScoreLabel(match.overall_score)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Sparkles size={21} />
                  </div>
                </div>
              ) : (
                <div className="max-w-xs">
                  <p className="text-sm font-semibold">Not evaluated yet</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Run AI matching to generate this candidate's score and
                    matching explanation.
                  </p>
                  <Link
                    to={`/jobs/${numericJobId}/ranking`}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-accent"
                  >
                    Go to ranking
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Experience</p>
            <Clock3 size={17} className="text-muted" />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
            {candidate.total_experience}
            <span className="ml-1 text-sm font-medium text-muted">yrs</span>
          </p>
          <p className="mt-2 text-xs text-muted">
            Job requirement: {job.minimum_experience} years
          </p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Required skills</p>
            <Target size={17} className="text-muted" />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
            {requiredMatchedCount}
            <span className="text-muted">/{job.required_skills.length}</span>
          </p>
          <p className="mt-2 text-xs text-muted">Skills matched</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Preferred skills</p>
            <Sparkles size={17} className="text-muted" />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
            {preferredMatchedCount}
            <span className="text-muted">/{job.preferred_skills.length}</span>
          </p>
          <p className="mt-2 text-xs text-muted">Skills matched</p>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">Resume added</p>
            <CalendarDays size={17} className="text-muted" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">
            {formatDate(candidate.created_at)}
          </p>
          <p className="mt-2 text-xs text-muted">Upload date</p>
        </div>
      </section>

      {match && (
        <section className="surface-card mb-10 p-6 md:p-8">
          <div className="mb-8 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <BrainCircuit size={19} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                AI evaluation
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                How this candidate scored
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                The overall score combines semantic relevance, required
                skills, experience and preferred skills.
              </p>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <ScoreBar
              label="Semantic similarity"
              score={match.semantic_score}
              description="How closely the resume aligns with the job description"
            />
            <ScoreBar
              label="Required skills"
              score={match.required_skill_score}
              description="Coverage of the required technical skills"
            />
            <ScoreBar
              label="Experience"
              score={match.experience_score}
              description="Candidate experience compared with the job requirement"
            />
            <ScoreBar
              label="Preferred skills"
              score={match.preferred_skill_score}
              description="Coverage of additional preferred skills"
            />
          </div>

          <div className="mt-8 rounded-xl bg-canvas p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <h3 className="text-sm font-semibold">AI matching explanation</h3>
            </div>
            <p className="text-sm leading-7 text-muted">
              {match.explanation}
            </p>
          </div>
        </section>
      )}

      <section className="surface-card mb-10 p-6 md:p-8">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Skill intelligence
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Skills against job requirements
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Skills extracted from the resume are compared with the skills
            specified for this role.
          </p>
        </div>

        {match ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <SkillGroup
              title="Required skills"
              skills={job.required_skills}
              matchedSkills={matchedSkillSet}
              emptyMessage="No required skills were specified for this job."
            />
            <SkillGroup
              title="Preferred skills"
              skills={job.preferred_skills}
              matchedSkills={matchedSkillSet}
              emptyMessage="No preferred skills were specified for this job."
            />
          </div>
        ) : (
          <div className="rounded-xl bg-canvas p-5 text-sm leading-6 text-muted">
            Run AI matching to see which job requirements this candidate
            satisfies.
          </div>
        )}

        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-3 text-sm font-semibold">
            All extracted candidate skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.extracted_skills.length > 0 ? (
              candidate.extracted_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-muted"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-muted">
                No skills were extracted from this resume.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card mb-10 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <GraduationCap size={19} />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">
              Education
            </h2>
            <p className="mt-1 text-xs text-muted">
              Education details extracted from the resume
            </p>
          </div>
        </div>

        {candidate.education.length > 0 ? (
          <div className="space-y-3">
            {candidate.education.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className="flex items-start gap-3 rounded-xl bg-canvas p-4"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-success"
                />
                <p className="text-sm leading-6">{entry}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No education details were extracted from this resume.
          </p>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
        <div>
          <p className="text-sm font-semibold">Review another candidate</p>
          <p className="mt-1 text-xs text-muted">
            Return to the ranked talent pool for this job.
          </p>
        </div>
        <Link
          to={`/jobs/${numericJobId}/ranking`}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
        >
          Back to ranking
          <ArrowUpRight size={15} />
        </Link>
      </section>
    </main>
  );
}

export default CandidateProfilePage;

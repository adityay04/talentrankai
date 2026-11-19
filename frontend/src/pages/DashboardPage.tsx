import {
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  FileSearch,
  Plus,
  Users,
} from "lucide-react";

function DashboardPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="flex h-20 items-center justify-between border-b border-border px-6 md:px-12">
        <a
          href="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          talent<span className="text-accent">rank.</span>
        </a>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block">
            Talent intelligence workspace
          </span>
          <button
            type="button"
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white transition hover:bg-accent-soft"
          >
            <Bell size={18} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
            A
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 md:py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Recruiter workspace
            </div>

            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Find your next
              <br />
              <span className="text-muted">great hire.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted">
              Bring your candidates together, understand their strengths, and
              make better hiring decisions with AI-powered matching.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent"
          >
            <Plus size={17} />
            Create a job
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="my-12 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Active jobs</p>
              <p className="font-display text-lg font-semibold">—</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Candidates screened</p>
              <p className="font-display text-lg font-semibold">—</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-muted">
              <FileSearch size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">Matches generated</p>
              <p className="font-display text-lg font-semibold">—</p>
            </div>
          </div>
        </div>

        <section className="surface-card relative overflow-hidden px-6 py-16 text-center md:px-12 md:py-24">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-accent-soft opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Your workspace starts here
            </p>

            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Your next great hire starts with the right match.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
              Create a job, upload your resumes, and let TalentRank evaluate
              candidates based on skills, experience, and semantic relevance.
            </p>

            <button
              type="button"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
            >
              <Plus size={17} />
              Create your first job
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        <footer className="mt-10 flex flex-col justify-between gap-3 text-xs text-muted sm:flex-row">
          <span>TalentRank · Intelligent hiring, thoughtfully designed.</span>
          <span>AI-assisted candidate evaluation</span>
        </footer>
      </section>
    </main>
  );
}

export default DashboardPage;

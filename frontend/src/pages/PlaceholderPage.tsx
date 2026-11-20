import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function PlaceholderPage({
  eyebrow,
  title,
  description
}: PlaceholderPageProps) {
  return (
    <main className="px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>

        <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
          {title}
        </h2>

        <p className="mt-6 max-w-xl text-base leading-8 text-muted">
          {description}
        </p>

        <div className="surface-card mt-12 p-8 md:p-12">
          <p className="text-sm font-semibold">Coming up next</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            We're building this workspace with real backend integration,
            carefully designed interactions, and transparent candidate
            evaluation.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3"
          >
            <ArrowLeft size={16} />
            Back to overview
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PlaceholderPage;

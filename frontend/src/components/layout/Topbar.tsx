import { Menu } from "lucide-react";
type TopbarProps = {
  title: string;
  onMenuClick: () => void;
};

function Topbar({ title, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-canvas/95 px-6 backdrop-blur-xl md:px-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-ink transition hover:bg-accent-soft md:hidden"
        >
          <Menu size={19} />
        </button>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            TalentRank / Workspace
          </p>
          <h1 className="mt-1 font-display text-lg font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted sm:block">
          Intelligent hiring, thoughtfully designed.
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          A
        </div>
      </div>
    </header>
  );
}

export default Topbar;

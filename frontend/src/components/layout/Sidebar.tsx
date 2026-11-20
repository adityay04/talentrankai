import { NavLink } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  LayoutDashboard,
  Users
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: BriefcaseBusiness
  },
  {
    label: "Candidates",
    path: "/candidates",
    icon: Users
  }
];

type SidebarProps = {
  onNavigate?: () => void;
};

function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-white">
      <div className="flex h-20 items-center border-b border-border px-7">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="font-display text-2xl font-semibold tracking-tight"
        >
          talent<span className="text-accent">rank.</span>
        </NavLink>
      </div>

      <div className="flex-1 px-4 py-8">
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-canvas hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-10 border-t border-border pt-7">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Your workspace
          </p>

          <div className="rounded-2xl bg-canvas p-4">
            <p className="text-sm font-semibold">Build your talent pipeline.</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Create a job and start evaluating candidates with AI.
            </p>
            <NavLink
              to="/jobs"
              onClick={onNavigate}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-accent transition hover:gap-3"
            >
              Explore jobs
              <ArrowUpRight size={14} />
            </NavLink>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Workspace Admin</p>
            <p className="text-xs text-muted">Recruiter account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

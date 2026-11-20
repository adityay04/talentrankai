import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/jobs": "Job management",
  "/candidates": "Candidates"
};

function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] ?? "Workspace";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          />
          <div className="relative h-full w-[280px] shadow-2xl">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-h-screen md:pl-[260px]">
        <Topbar
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <div className="mx-auto max-w-[1600px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;

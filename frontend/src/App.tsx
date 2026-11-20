import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./app/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import JobManagementPage from "./pages/JobManagementPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import CandidateRankingPage from "./pages/CandidateRankingPage";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobManagementPage />} />
          <Route
            path="/jobs/:jobId/candidates"
            element={<ResumeUploadPage />}
          />
          <Route
            path="/jobs/:jobId/ranking"
            element={<CandidateRankingPage />}
          />
          <Route
            path="/jobs/:jobId/candidates/:candidateId"
            element={<CandidateProfilePage />}
          />
          <Route
            path="/candidates"
            element={
              <PlaceholderPage
                eyebrow="Candidate intelligence"
                title="Meet your next great hire."
                description="Review candidate profiles, compare relevant skills, and explore AI-generated matching explanations."
              />
            }
          />
          <Route
            path="*"
            element={
              <PlaceholderPage
                eyebrow="Not found"
                title="This page doesn't exist."
                description="The page you're looking for could not be found."
              />
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;

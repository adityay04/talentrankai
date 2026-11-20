import { apiRequest } from "../../lib/api";
import type {
  BatchUploadResponse,
  Candidate,
  MatchResult,
} from "./candidate.types";

export function uploadResumes(
  jobId: number,
  files: File[],
): Promise<BatchUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return apiRequest<BatchUploadResponse>(`/jobs/${jobId}/candidates/upload`, {
    method: "POST",
    body: formData,
  });
}

export function getCandidates(jobId: number): Promise<Candidate[]> {
  return apiRequest<Candidate[]>(`/jobs/${jobId}/candidates/`);
}

export function getCandidate(
  jobId: number,
  candidateId: number,
): Promise<Candidate> {
  return apiRequest<Candidate>(`/jobs/${jobId}/candidates/${candidateId}`);
}

export function getMatchResults(jobId: number): Promise<MatchResult[]> {
  return apiRequest<MatchResult[]>(`/jobs/${jobId}/matches/`);
}

export function runMatching(jobId: number): Promise<MatchResult[]> {
  return apiRequest<MatchResult[]>(`/jobs/${jobId}/matches/`, {
    method: "POST",
  });
}

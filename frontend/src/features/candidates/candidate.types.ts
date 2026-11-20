export interface Candidate {
  id: number;
  job_id: number;
  source_filename: string;
  name: string;
  email: string | null;
  total_experience: number;
  extracted_skills: string[];
  education: string[];
  created_at: string;
}

export interface CandidateUploadItem {
  filename: string;
  status: "success" | "failed";
  candidate_id?: number;
  name?: string;
  email?: string | null;
  total_experience?: number;
  extracted_text_length?: number;
  error?: string;
}

export interface BatchUploadResponse {
  job_id: number;
  total_files: number;
  successful_uploads: number;
  failed_uploads: number;
  results: CandidateUploadItem[];
}

export interface MatchResult {
  rank: number;
  candidate_id: number;
  candidate_name: string;
  email: string | null;
  overall_score: number;
  semantic_score: number;
  required_skill_score: number;
  experience_score: number;
  preferred_skill_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation: string;
  created_at: string;
}

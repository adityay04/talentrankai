export interface Job {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  qualifications: string[];
  created_at: string;
}

export interface JobCreatePayload {
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number;
  qualifications: string[];
}

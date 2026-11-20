import { apiRequest } from "../../lib/api";
import type { Job, JobCreatePayload } from "./job.types";

export function getJobs(): Promise<Job[]> {
  return apiRequest<Job[]>("/jobs/");
}

export function getJob(jobId: number): Promise<Job> {
  return apiRequest<Job>(`/jobs/${jobId}`);
}

export function createJob(payload: JobCreatePayload): Promise<Job> {
  return apiRequest<Job>("/jobs/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

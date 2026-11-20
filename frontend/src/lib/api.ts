const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

type ApiError = {
  detail?: string | { msg?: string }[];
  message?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error(
      "Unable to connect to TalentRank. Check whether the backend server is running."
    );
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = (await response.json()) as ApiError;

      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((item) => item.msg || "Invalid input")
          .join(", ");
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

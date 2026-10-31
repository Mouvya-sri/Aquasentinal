const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function getApiHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) throw new Error("API is unavailable");
  return response.json();
}

export async function getAnalyses() {
  const response = await fetch(`${API_BASE}/api/analyses`);
  if (!response.ok) throw new Error("Could not load analyses");
  return response.json();
}

export async function submitAnalysis(file, kind) {
  const body = new FormData();
  body.append("media", file);
  body.append("kind", kind);
  const response = await fetch(`${API_BASE}/api/analyze`, { method: "POST", body });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Analysis upload failed");
  return data;
}

export async function getMatchedJobs() {
  const res = await fetch("/api/ai/match-jobs", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch matched jobs");
  return res.json();
}
export async function generateCoverLetter(jobTitle, resumeText) {
  const res = await fetch("/api/ai/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ jobTitle, resumeText }),
  });
  if (!res.ok) throw new Error("Failed to generate cover letter");
  return res.json();
}
export async function parseResumeAI(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch("/api/resume/parse", {
    method: "POST",
    body: formData,
    credentials: "include"
  });

  if (!response.ok) throw new Error("Resume parsing failed");
  return await response.json();
}
/**
 * Thin wrapper around the GitHub Contents API.
 *
 * Vercel's production runtime is read-only — a serverless function can't
 * persist a file write to disk. So instead of writing to the local
 * filesystem, every admin save commits the updated file straight to the
 * GitHub repo via the API below. That push triggers Vercel's normal
 * GitHub integration, which rebuilds and redeploys automatically —
 * usually live within 1–2 minutes.
 *
 * Required environment variables (set in Vercel → Project → Settings →
 * Environment Variables):
 *   GITHUB_TOKEN  — a fine-grained personal access token with
 *                   "Contents: Read and write" permission on this repo
 *   GITHUB_OWNER  — your GitHub username, e.g. "cemmanuel-001"
 *   GITHUB_REPO   — the repo name, e.g. "The-Lean-Kitchen-Edit"
 *   GITHUB_BRANCH — optional, defaults to "main"
 */

const API_BASE = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub configuration. Set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in your Vercel project's Environment Variables."
    );
  }

  return { token, owner, repo, branch };
}

async function githubFetch(path: string, init?: RequestInit) {
  const { token } = getConfig();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
  return res;
}

/** Get a file's current content (decoded string) and its sha (needed to update it). */
export async function getFile(filePath: string): Promise<{ content: string; sha: string } | null> {
  const { owner, repo, branch } = getConfig();
  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed for ${filePath}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

/** Create or update a text file (e.g. a JSON content file) with a commit message. */
export async function putFile(filePath: string, newContent: string, message: string) {
  const { owner, repo, branch } = getConfig();
  const existing = await getFile(filePath);

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(newContent, "utf-8").toString("base64"),
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed for ${filePath}: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/** Upload a binary file (e.g. an image) given base64-encoded data. */
export async function putBinaryFile(filePath: string, base64Data: string, message: string) {
  const { owner, repo, branch } = getConfig();
  const existing = await getFile(filePath).catch(() => null);

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: base64Data,
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub image upload failed for ${filePath}: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

/** Delete a file from the repo. */
export async function deleteFile(filePath: string, message: string) {
  const { owner, repo, branch } = getConfig();
  const existing = await getFile(filePath);
  if (!existing) return;

  const res = await githubFetch(`/repos/${owner}/${repo}/contents/${filePath}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha: existing.sha, branch }),
  });

  if (!res.ok) {
    throw new Error(`GitHub delete failed for ${filePath}: ${res.status} ${await res.text()}`);
  }
}

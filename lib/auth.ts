export const SESSION_COOKIE = "lke_admin_session";

/**
 * Single-admin auth: no user database, just one shared password stored in
 * the ADMIN_PASSWORD environment variable. The session cookie is a hash of
 * the password + a secret, so it can be verified without a session store.
 *
 * Uses the Web Crypto API (globalThis.crypto.subtle) rather than Node's
 * "crypto" module, since this code runs in middleware on Next.js's Edge
 * runtime, which doesn't support Node-only modules. Web Crypto works in
 * both the Edge runtime and modern Node.js.
 */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function expectedSessionValue(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || "lean-kitchen-edit";
  if (!password) {
    throw new Error("Missing ADMIN_PASSWORD environment variable.");
  }
  return sha256Hex(`${password}:${secret}`);
}

export function checkPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return candidate === password;
}

export async function makeSessionCookieValue(): Promise<string> {
  return expectedSessionValue();
}

export async function isValidSessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  try {
    const expected = await expectedSessionValue();
    return value === expected;
  } catch {
    return false;
  }
}

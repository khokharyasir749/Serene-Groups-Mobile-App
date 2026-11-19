/** Turns any RTK Query / thrown error into a user-facing message. */
export function parseError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  const e = err as { status?: number | string; data?: { message?: string }; error?: string; message?: string };
  if (e.data && typeof e.data.message === "string" && e.data.message) return e.data.message;
  if (e.status === "FETCH_ERROR") return "Can't reach the server. Check your connection.";
  if (e.status === "TIMEOUT_ERROR") return "The request timed out. Please try again.";
  if (typeof e.error === "string" && e.error) return e.error;
  if (typeof e.message === "string" && e.message) return e.message;
  return fallback;
}

export const isUnauthorized = (err: unknown) => (err as { status?: unknown })?.status === 401;

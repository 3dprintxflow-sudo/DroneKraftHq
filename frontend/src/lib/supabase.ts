import { createClient, type AuthError, type Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

const supabaseStorageKey = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
const supabaseSessionKeys = [
  supabaseStorageKey,
  `${supabaseStorageKey}-code-verifier`,
  `${supabaseStorageKey}-user`,
];

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: supabaseStorageKey,
  },
});

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === "string" ? error : "";
}

export function isInvalidRefreshTokenError(error: unknown): error is AuthError {
  const message = getErrorMessage(error);

  return (
    message.includes("Invalid Refresh Token") ||
    message.includes("Refresh Token Not Found")
  );
}

function clearStoredSupabaseSession() {
  if (typeof window === "undefined") {
    return;
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of supabaseSessionKeys) {
      storage.removeItem(key);
    }
  }
}

export async function resetSupabaseSession() {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error && !isInvalidRefreshTokenError(error)) {
      console.warn("Failed to clear Supabase session via signOut:", error);
    }
  } catch (error) {
    if (!isInvalidRefreshTokenError(error)) {
      console.warn("Failed to clear Supabase session via signOut:", error);
    }
  } finally {
    clearStoredSupabaseSession();
  }
}

export async function getSessionSafely(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        console.warn("Clearing stale Supabase session after refresh token failure.", error);
        await resetSupabaseSession();
        return null;
      }

      console.error("Failed to load Supabase session:", error);
      return null;
    }

    return data.session;
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      console.warn("Clearing stale Supabase session after refresh token failure.", error);
      await resetSupabaseSession();
      return null;
    }

    console.error("Unexpected Supabase session error:", error);
    return null;
  }
}

export async function getAccessTokenSafely() {
  const session = await getSessionSafely();
  return session?.access_token ?? null;
}

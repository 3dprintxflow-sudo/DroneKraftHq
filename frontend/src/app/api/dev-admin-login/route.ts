import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function formatDevAdminAuthError(message: string) {
  if (
    message.includes("Database error querying schema") ||
    message.includes("Database error finding user")
  ) {
    return [
      "Supabase rejected the configured dev admin account before a session could be created.",
      "This usually means the auth user was seeded manually and is now malformed.",
      "Delete and recreate the user through Supabase Auth, then promote its profile to role='admin'.",
      "The repo's schema.sql has been updated to stop inserting directly into auth.users.",
    ].join(" ");
  }

  return message;
}

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Dev admin login is disabled in production." },
      { status: 403 },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.DEV_ADMIN_EMAIL;
  const password = process.env.DEV_ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseAnonKey || !email || !password) {
    return NextResponse.json(
      { error: "Missing dev admin login environment variables." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      {
        error: formatDevAdminAuthError(
          error?.message || "Unable to sign in as the dev admin.",
        ),
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  });
}

"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, getSessionSafely, isInvalidRefreshTokenError, resetSupabaseSession } from "@/lib/supabase";
import api from "@/lib/api";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

/* ── Types ── */
export type Role = "admin" | "customer" | "pilot" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  tier: "Bronze" | "Silver" | "Gold";
  bookingCount: number;
  joinedDate: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isPilot: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isAdmin: false,
  isPilot: false,
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabaseUser: SupabaseUser) => {
    const fallbackName =
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.email?.split("@")[0] ||
      "Pilot";

    try {
      const response = await api.get("/users/me");
      const profile = response.data;

      setUser({
        id: supabaseUser.id,
        name: profile.full_name || fallbackName,
        email: supabaseUser.email || "",
        role: profile.role ?? "customer",
        avatar:
          profile.avatar_url ||
          (profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : fallbackName.substring(0, 2).toUpperCase()),
        tier: profile.tier ?? "Bronze",
        bookingCount: profile.booking_count ?? 0,
        joinedDate: profile.created_at
          ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      });
    } catch (error) {
      // API unavailable — fall back to Supabase profiles table directly
      console.warn("Backend API unavailable, falling back to Supabase direct query:", error);
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, tier, booking_count, avatar_url, created_at")
          .eq("id", supabaseUser.id)
          .single();

        setUser({
          id: supabaseUser.id,
          name: profile?.full_name || fallbackName,
          email: supabaseUser.email || "",
          role: profile?.role ?? "customer",
          avatar:
            supabaseUser.user_metadata?.avatar_url ||
            profile?.avatar_url ||
            (profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : fallbackName.substring(0, 2).toUpperCase()),
          tier: profile?.tier ?? "Bronze",
          bookingCount: profile?.booking_count ?? 0,
          joinedDate: profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        });
      } catch {
        // Absolute last resort — minimal fallback
        setUser({
          id: supabaseUser.id,
          name: fallbackName,
          email: supabaseUser.email || "",
          role: "customer",
          avatar: supabaseUser.user_metadata?.avatar_url || fallbackName.substring(0, 2).toUpperCase(),
          tier: "Bronze",
          bookingCount: 0,
          joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const applySession = async (session: Session | null) => {
      if (!isActive) {
        return;
      }

      if (session?.user) {
        await fetchProfile(session.user);
        return;
      }

      setUser(null);
      setLoading(false);
    };

    const loadInitialSession = async () => {
      setLoading(true);
      const session = await getSessionSafely();
      await applySession(session);
    };

    void loadInitialSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        return;
      }

      void applySession(session);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email,
      password,
    });
    if (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    alert("Sign up successful! Please check your email to confirm your account.");
  }, []);


  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        await resetSupabaseSession();
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(false);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin: user?.role === "admin",
        isPilot: user?.role === "pilot",
        isLoggedIn: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

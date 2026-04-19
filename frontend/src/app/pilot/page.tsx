"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Loader2, MapPin, Calendar, CheckCircle2, Zap, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

/* ── Types ── */
interface Mission {
  id: string;
  service_name?: string;
  mission_date: string;
  location: string;
  status: string;
  total_amount: number | null;
  client_id: string;
  message?: string;
}

const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  confirmed: { color: "#00f3ff", bg: "rgba(0,243,255,0.1)",   label: "Confirmed"  },
  active:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   label: "Active"     },
  completed: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", label: "Completed"  },
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Pending"    },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)", label: "Cancelled"  },
};

const fadeUp: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.08 } } };

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status.toLowerCase()] ?? STATUS_CFG.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", padding: "0.2rem 0.6rem", borderRadius: "9999px", color: cfg.color, background: cfg.bg, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: "9999px", background: cfg.color, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "rgba(0,15,30,0.72)", border: "1px solid rgba(0,243,255,0.12)", borderRadius: "1.25rem", padding: "1.5rem", backdropFilter: "blur(16px)", ...style }}>
      {children}
    </div>
  );
}

export default function PilotDashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const router = useRouter();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Auth guard — pilots only
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { router.replace("/"); return; }
    if (user?.role !== "pilot") { router.replace("/dashboard"); return; }
  }, [isLoggedIn, authLoading, user, router]);

  const fetchMissions = async () => {
    try {
      const res = await api.get("/bookings");
      setMissions(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch missions", err);
      setError("Failed to load missions. Please refresh.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.role === "pilot") fetchMissions();
  }, [isLoggedIn, user]);

  const updateMissionStatus = async (missionId: string, newStatus: "active" | "completed") => {
    setUpdating(missionId);
    try {
      await api.patch(`/bookings/${missionId}/mission-update`, { status: newStatus });
      await fetchMissions();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Update failed. Try again.");
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || !isLoggedIn || user?.role !== "pilot") {
    return (
      <div style={{ background: "#030810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={40} color="#00f3ff" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const active    = missions.filter(m => m.status === "active");
  const confirmed = missions.filter(m => m.status === "confirmed");
  const completed = missions.filter(m => m.status === "completed");

  const kpis = [
    { label: "Assigned",  value: confirmed.length, color: "#00f3ff" },
    { label: "Active",    value: active.length,    color: "#22c55e" },
    { label: "Completed", value: completed.length, color: "#a78bfa" },
    { label: "Total",     value: missions.length,  color: "#f59e0b" },
  ];

  return (
    <main style={{ background: "#030810", minHeight: "100vh", paddingBottom: "7rem" }}>
      <Navbar />

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,243,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,243,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "7rem 1.5rem 2rem" }}>
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "9999px", background: "linear-gradient(135deg,#00f3ff,#0088ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, color: "#030810", fontFamily: "var(--font-orbitron), monospace", boxShadow: "0 0 24px rgba(0,243,255,0.5)", flexShrink: 0 }}>
                {user?.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(0,243,255,0.6)", fontFamily: "var(--font-orbitron), monospace", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                  🛩️ Pilot Console
                </p>
                <h1 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "0.25rem" }}>
                  {user?.name}
                </h1>
                <span style={{ fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700, letterSpacing: "0.1em" }}>
                  ⭐ {user?.tier} Pilot
                </span>
              </div>
            </div>
          </motion.div>

          {/* KPI Row */}
          <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {kpis.map(({ label, value, color }) => (
              <Card key={label} style={{ padding: "1.25rem", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "2rem", fontWeight: 900, color, lineHeight: 1, marginBottom: "0.4rem" }}>{value}</p>
                <p style={{ fontSize: "0.6rem", color: "#6b7280", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</p>
              </Card>
            ))}
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: "0.75rem", color: "#f87171", marginBottom: "1.5rem" }}>
              <AlertTriangle size={16} /> {error}
            </motion.div>
          )}

          {/* Mission List */}
          <motion.div variants={fadeUp}>
            <Card>
              <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00f3ff", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                My Assigned Missions
              </h2>

              {dataLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                  <Loader2 size={28} color="#00f3ff" style={{ animation: "spin 1s linear infinite" }} />
                </div>
              ) : missions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>
                  <CheckCircle2 size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                  <p style={{ fontSize: "0.8rem" }}>No missions assigned yet.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {missions.map((m) => (
                    <motion.div
                      key={m.id}
                      variants={fadeUp}
                      style={{ background: "rgba(0,243,255,0.03)", border: "1px solid rgba(0,243,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "flex-start" }}>
                        {/* Mission info */}
                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                            <span style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.65rem", color: "#00f3ff" }}>
                              MIS-{m.id.substring(0, 8).toUpperCase()}
                            </span>
                            <StatusBadge status={m.status} />
                          </div>
                          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                            {m.service_name || "Custom Mission"}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#9ca3af" }}>
                              <Calendar size={12} color="#00f3ff" /> {m.mission_date}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#9ca3af" }}>
                              <MapPin size={12} color="#00f3ff" /> {m.location}
                            </span>
                            {m.total_amount && (
                              <span style={{ fontSize: "0.7rem", color: "#22c55e", fontWeight: 700 }}>
                                ₹{m.total_amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {m.message && (
                            <p style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.5rem", fontStyle: "italic" }}>
                              "{m.message}"
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", flexShrink: 0 }}>
                          {m.status !== "completed" && m.status !== "cancelled" ? (
                            <>
                              <button
                                disabled={updating === m.id || m.status !== "confirmed"}
                                onClick={() => updateMissionStatus(m.id, "active")}
                                style={{
                                  display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: "0.625rem",
                                  background: m.status === "confirmed" ? "linear-gradient(135deg,#00f3ff,#0088ff)" : "rgba(0,243,255,0.05)",
                                  color: m.status === "confirmed" ? "#030810" : "rgba(0,243,255,0.3)",
                                  fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", border: m.status === "confirmed" ? "none" : "1px solid rgba(0,243,255,0.1)",
                                  cursor: (updating === m.id || m.status !== "confirmed") ? "not-allowed" : "pointer",
                                  opacity: updating === m.id ? 0.7 : 1, fontFamily: "var(--font-orbitron), monospace", transition: "all 0.3s"
                                }}
                              >
                                {updating === m.id && m.status === "confirmed" ? <Loader2 size={12} className="animate-spin" /> : <Zap size={14} />}
                                START MISSION
                              </button>

                              <button
                                disabled={updating === m.id || m.status !== "active"}
                                onClick={() => updateMissionStatus(m.id, "completed")}
                                style={{
                                  display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem", borderRadius: "0.625rem",
                                  background: m.status === "active" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(34,197,94,0.05)",
                                  color: m.status === "active" ? "#fff" : "rgba(34,197,94,0.3)",
                                  fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", border: m.status === "active" ? "none" : "1px solid rgba(34,197,94,0.1)",
                                  cursor: (updating === m.id || m.status !== "active") ? "not-allowed" : "pointer",
                                  opacity: updating === m.id ? 0.7 : 1, fontFamily: "var(--font-orbitron), monospace", transition: "all 0.3s"
                                }}
                              >
                                {updating === m.id && m.status === "active" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                COMPLETE
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: "0.65rem", color: m.status === "completed" ? "#a78bfa" : "#f87171", fontWeight: 700, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {m.status === "completed" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                              MISSION {m.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}

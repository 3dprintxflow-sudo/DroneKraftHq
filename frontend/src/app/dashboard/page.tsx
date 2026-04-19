"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  Calendar, MapPin, Zap, Award, Clock,
  CheckCircle2, Loader2, ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";

/* ── Types ── */
interface Booking {
  id: string;
  service?: string;       // from new POST /bookings response
  service_name?: string;  // from GET /bookings list response
  date?: string;          // new response field
  mission_date?: string;  // old field – keep for compatibility
  location?: string;
  status: string;
  amount?: number | null;
  total_amount?: number | null;
  created_at?: string;
}

// Normalise any booking shape into a consistent display object
function normaliseBooking(b: Booking) {
  return {
    id: b.id,
    service: b.service ?? b.service_name ?? "Custom",
    date: b.date ?? b.mission_date ?? "—",
    status: b.status,
    location: b.location ?? "—",
    amount: b.amount ?? b.total_amount ?? null,
  };
}

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  completed: { color: "#22c55e", bg: "rgba(34,197,94,0.12)",  label: "Completed" },
  active:    { color: "#00f3ff", bg: "rgba(0,243,255,0.12)", label: "Active" },
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Pending" },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Cancelled" },
};

/* ── Reusable Components ── */
function DCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(0,15,30,0.7)",
      border: "1px solid rgba(0,243,255,0.12)",
      borderRadius: "1.25rem",
      padding: "1.75rem",
      backdropFilter: "blur(16px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em",
      padding: "0.2rem 0.6rem", borderRadius: "9999px",
      color: s.color, background: s.bg,
      textTransform: "uppercase",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "9999px", background: s.color, display: "inline-block" }} />
      {s.label}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = { Bronze: "#cd7f32", Silver: "#a8a9ad", Gold: "#f59e0b" };
  const c = colors[tier] ?? "#f59e0b";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em",
      padding: "0.25rem 0.75rem", borderRadius: "9999px",
      color: c, background: `${c}22`, border: `1px solid ${c}44`,
      textTransform: "uppercase",
    }}>
      🏅 {tier} Tier
    </span>
  );
}

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.09 } } };

export default function CustomerDashboard() {
  const { user, isLoggedIn, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "bookings">("overview");
  const [bookings, setBookings] = useState<ReturnType<typeof normaliseBooking>[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      const raw: Booking[] = res.data ?? [];
      setBookings(raw.map(normaliseBooking));
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Auth guards
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { router.replace("/"); return; }
    if (isAdmin) { router.replace("/admin"); return; }
    if (user?.role === "pilot") { router.replace("/pilot"); return; }
  }, [isLoggedIn, isAdmin, authLoading, user, router]);

  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      fetchBookings();
    }
  }, [isLoggedIn, isAdmin]);

  const handleDummyPayment = async (bookingId: string) => {
    try {
      setPaymentLoading(bookingId);
      await api.post("/payments/dummy", { booking_id: bookingId });
      alert("✅ Payment Successful! Your mission is now confirmed.");
      await fetchBookings();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "❌ Payment failed");
    } finally {
      setPaymentLoading(null);
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter(b => b.status.toLowerCase() === "active").length;
    const hours = bookings.filter(b => b.status.toLowerCase() === "completed").length * 2.5;
    const points = user?.bookingCount ? user.bookingCount * 200 : 0;

    return [
      { icon: Calendar, label: "Total Bookings",  value: total.toString(), delta: "+1 this month", color: "#00f3ff" },
      { icon: Zap,      label: "Active Missions",  value: active.toString(), delta: "In progress",   color: "#22c55e" },
      { icon: Clock,    label: "Hours Flown",      value: hours.toFixed(1), delta: "Total flight time", color: "#a78bfa" },
      { icon: Award,    label: "Loyalty Points",   value: points.toLocaleString(), delta: "Lifetime reward", color: "#f59e0b" },
    ];
  }, [bookings, user]);

  // Show spinner while auth resolves or while redirecting admin
  if (authLoading || !isLoggedIn || isAdmin) {
    return (
      <div style={{ background: "#030810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={40} color="#00f3ff" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const tabStyle = (id: string): React.CSSProperties => ({
    padding: "0.5rem 1.25rem", borderRadius: "9999px",
    fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", cursor: "pointer", border: "none",
    fontFamily: "var(--font-orbitron), monospace", transition: "all 0.25s",
    background: activeTab === id ? "linear-gradient(135deg,#00f3ff,#0088ff)" : "rgba(0,243,255,0.06)",
    color: activeTab === id ? "#030810" : "rgba(0,243,255,0.65)",
    boxShadow: activeTab === id ? "0 0 20px rgba(0,243,255,0.3)" : "none",
  });

  const TH = ({ h }: { h: string }) => (
    <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#4b5563", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
  );

  return (
    <main style={{ background: "#030810", minHeight: "100vh", paddingBottom: "7rem" }}>
      <Navbar />

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,243,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,243,255,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "72rem", margin: "0 auto", padding: "7rem 1.5rem 2rem" }}>
        <motion.div variants={stagger} initial="hidden" animate="show">

          {/* ── Header ── */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "9999px", background: "linear-gradient(135deg,#00f3ff,#0088ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 900, color: "#030810", fontFamily: "var(--font-orbitron), monospace", boxShadow: "0 0 24px rgba(0,243,255,0.5)", flexShrink: 0 }}>
                {user?.avatar}
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(0,243,255,0.6)", fontFamily: "var(--font-orbitron), monospace", textTransform: "uppercase", marginBottom: "0.25rem" }}>Welcome Back</p>
                <h1 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: "0.5rem" }}>{user?.name}</h1>
                <TierBadge tier={user?.tier || "Bronze"} />
              </div>
            </div>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {(["overview", "bookings"] as const).map((tab) => (
              <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </motion.div>

          {dataLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
              <Loader2 size={32} color="#00f3ff" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <>
              {/* ── Overview Tab ── */}
              {activeTab === "overview" && (
                <motion.div variants={stagger} initial="hidden" animate="show">
                  {/* KPI Cards */}
                  <motion.div variants={fadeUp} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    {stats.map(({ icon: Icon, label, value, delta, color }) => (
                      <DCard key={label} style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                          <Icon size={18} color={color} />
                          <span style={{ fontSize: "0.6rem", color: "rgba(34,197,94,0.8)", letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <ArrowUpRight size={10} /> {delta}
                          </span>
                        </div>
                        <p style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.8rem", fontWeight: 900, color, marginBottom: "0.2rem", lineHeight: 1 }}>{value}</p>
                        <p style={{ fontSize: "0.65rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
                      </DCard>
                    ))}
                  </motion.div>

                  {/* Recent missions table */}
                  <motion.div variants={fadeUp}>
                    <DCard>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00f3ff", textTransform: "uppercase" }}>Recent Missions</h2>
                        <button onClick={() => setActiveTab("bookings")} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", cursor: "pointer", color: "rgba(0,243,255,0.65)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          View All <ChevronRight size={12} />
                        </button>
                      </div>
                      {bookings.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem 0", color: "#4b5563" }}>
                          <CheckCircle2 size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                          <p style={{ fontSize: "0.8rem" }}>No missions yet. Book your first flight!</p>
                        </div>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid rgba(0,243,255,0.08)" }}>
                                {["Mission ID", "Service", "Date", "Status", "Location"].map(h => <TH key={h} h={h} />)}
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.slice(0, 3).map((b) => (
                                <tr key={b.id} style={{ borderBottom: "1px solid rgba(0,243,255,0.05)" }}>
                                  <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.68rem", color: "#00f3ff", fontFamily: "var(--font-orbitron), monospace" }}>{b.id.substring(0, 8).toUpperCase()}</td>
                                  <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.75rem", color: "#e5e7eb", fontWeight: 600 }}>{b.service}</td>
                                  <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.75rem", color: "#e5e7eb" }}>{b.date}</td>
                                  <td style={{ padding: "0.875rem 0.75rem" }}><StatusBadge status={b.status} /></td>
                                  <td style={{ padding: "0.875rem 0.75rem", fontSize: "0.72rem", color: "#6b7280" }}>{b.location}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </DCard>
                  </motion.div>
                </motion.div>
              )}

              {/* ── Bookings Tab ── */}
              {activeTab === "bookings" && (
                <motion.div variants={fadeUp} initial="hidden" animate="show">
                  <DCard>
                    <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00f3ff", textTransform: "uppercase", marginBottom: "1.5rem" }}>All Missions</h2>
                    {bookings.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem 0", color: "#4b5563" }}>
                        <CheckCircle2 size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
                        <p style={{ fontSize: "0.8rem" }}>No missions booked yet.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(0,243,255,0.1)" }}>
                              {["Mission ID", "Service", "Date", "Location", "Status", "Amount", "Action"].map(h => <TH key={h} h={h} />)}
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((b) => (
                              <tr key={b.id} style={{ borderBottom: "1px solid rgba(0,243,255,0.04)" }}>
                                <td style={{ padding: "1rem 0.75rem", fontSize: "0.68rem", color: "#00f3ff", fontFamily: "var(--font-orbitron), monospace" }}>{b.id.substring(0, 8).toUpperCase()}</td>
                                <td style={{ padding: "1rem 0.75rem", fontSize: "0.75rem", color: "#e5e7eb", fontWeight: 600 }}>{b.service}</td>
                                <td style={{ padding: "1rem 0.75rem", fontSize: "0.75rem", color: "#e5e7eb" }}>{b.date}</td>
                                <td style={{ padding: "1rem 0.75rem", fontSize: "0.72rem", color: "#9ca3af" }}><MapPin size={10} style={{ display: "inline", marginRight: 4 }} />{b.location}</td>
                                <td style={{ padding: "1rem 0.75rem" }}><StatusBadge status={b.status} /></td>
                                <td style={{ padding: "1rem 0.75rem", fontSize: "0.75rem", color: "#e5e7eb", fontWeight: 600 }}>₹{b.amount?.toLocaleString() ?? "—"}</td>
                                <td style={{ padding: "1rem 0.75rem" }}>
                                  {b.status.toLowerCase() === "pending" && (
                                    <button
                                      disabled={paymentLoading === b.id}
                                      onClick={() => handleDummyPayment(b.id)}
                                      className="btn-neon-solid"
                                      style={{
                                        padding: "0.4rem 0.8rem",
                                        borderRadius: "0.5rem",
                                        fontSize: "0.6rem",
                                        fontWeight: 900,
                                        letterSpacing: "0.05em",
                                        whiteSpace: "nowrap"
                                      }}
                                    >
                                      {paymentLoading === b.id ? <Loader2 size={12} className="animate-spin" /> : "PAY NOW"}
                                    </button>
                                  )}
                                  {b.status.toLowerCase() === "confirmed" && (
                                    <span style={{ fontSize: "0.6rem", color: "#22c55e", fontWeight: 700 }}>✓ PAID</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DCard>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}

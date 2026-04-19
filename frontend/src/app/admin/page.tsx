"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Layers,
  Settings, ArrowUpRight,
  CheckCircle, XCircle, Clock,
  Menu, Zap, DollarSign, Loader2,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import api from "@/lib/api";

/* ── Types ── */
interface Booking {
  id: string;
  client_id: string;
  service_id: string;
  service_name?: string;
  mission_date: string;
  location: string;
  status: string;
  pilot_id: string | null;
  amount: number | null;
  total_amount?: number | null;
  created_at: string;
}

const STATUS_CFG: Record<string, { color: string; bg: string }> = {
  completed: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  active:    { color: "#00f3ff", bg: "rgba(0,243,255,0.12)" },
  pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

/* ── Shared Components ── */
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_CFG[status.toLowerCase()] ?? { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em", padding:"0.2rem 0.6rem", borderRadius:"9999px", color:s.color, background:s.bg, textTransform:"uppercase", whiteSpace:"nowrap" }}>
      <span style={{ width:5, height:5, borderRadius:"9999px", background:s.color, display:"inline-block" }} />
      {status}
    </span>
  );
}

function ACard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background:"rgba(0,15,30,0.72)", border:"1px solid rgba(0,243,255,0.1)", borderRadius:"1.25rem", padding:"1.5rem", backdropFilter:"blur(16px)", ...style }}>
      {children}
    </div>
  );
}

type SectionId = "overview" | "bookings" | "pilots" | "services" | "settings";

const SIDEBAR_ITEMS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "bookings",  label: "Bookings",  icon: Calendar        },
  { id: "pilots",    label: "Pilots",    icon: Users           },
  { id: "services",  label: "Services",  icon: Layers          },
  { id: "settings",  label: "Settings",  icon: Settings        },
];

export default function AdminDashboard() {
  const { user, isAdmin, isLoggedIn, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pilots, setPilots] = useState<{id:string; name:string; status:string}[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null); // booking being assigned
  const [showPilotForm, setShowPilotForm] = useState(false);
  const [newPilot, setNewPilot] = useState({ email: "", password: "", full_name: "" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) { router.replace("/"); return; }
    if (!authLoading && isLoggedIn && !isAdmin) { router.replace("/dashboard"); }
  }, [isLoggedIn, isAdmin, authLoading, router]);

  const fetchAllData = async () => {
    try {
      const [bookRes, pilotRes, statsRes, revRes, servRes] = await Promise.all([
        api.get("/bookings"),
        api.get("/admin/pilots"),
        api.get("/admin/stats"),
        api.get("/admin/revenue"),
        api.get("/services"),
      ]);
      setBookings(bookRes.data);
      setPilots(pilotRes.data);
      setStats(statsRes.data);
      setRevenueData(revRes.data);
      setServices(servRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      fetchAllData();
    }
  }, [isLoggedIn, isAdmin]);

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      await fetchAllData();
    } catch (err) {
      console.error("Update failed", err);
      alert("Status update failed.");
    }
  };

  const handleAssignPilot = async (bookingId: string, pilotId: string) => {
    try {
      await api.post(`/admin/assign`, { booking_id: bookingId, pilot_id: pilotId });
      setAssigningId(null);
      await fetchAllData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to assign pilot.");
    }
  };

  const handleCreatePilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.post("/admin/pilots", newPilot);
      setNewPilot({ email: "", password: "", full_name: "" });
      setShowPilotForm(false);
      await fetchAllData();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to create pilot.");
    } finally {
      setFormLoading(false);
    }
  };

  const kpis = useMemo(() => {
    if (!stats) return [
      { icon: DollarSign, label: "Revenue", value: "₹0", color: "#22c55e", sub: "0% growth" },
      { icon: Calendar,   label: "Bookings", value: "0", color: "#00f3ff", sub: "+0" },
      { icon: Zap,        label: "Missions Active", value: "0", color: "#a78bfa", sub: "0 en route" },
      { icon: Users,      label: "Customers", value: "0", color: "#f59e0b", sub: "+0 this week" },
    ];

    return [
      { icon: DollarSign, label: "Revenue (Total)",  value: `₹${stats.revenue.toLocaleString()}`, color: "#22c55e", sub: stats.revenue_growth },
      { icon: Calendar,   label: "Bookings (Total)", value: stats.bookings.toString(),  color: "#00f3ff", sub: stats.bookings_growth },
      { icon: Zap,        label: "Missions Active",  value: stats.active_pilots.toString(), color: "#a78bfa", sub: `${stats.active_pilots} en route` },
      { icon: Users,      label: "Total Customers",  value: stats.total_customers.toString(), color: "#f59e0b", sub: stats.customers_growth },
    ];
  }, [stats]);

  if (authLoading || !isLoggedIn || !isAdmin || !user) {
    return (
      <div style={{ background: "#030810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={40} color="#00f3ff" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div style={{
      width: mobile ? "100%" : 220, background: "rgba(0,10,22,0.9)", borderRight: mobile ? "none" : "1px solid rgba(0,243,255,0.08)",
      display: "flex", flexDirection: "column", height: mobile ? "auto" : "100vh", position: mobile ? "relative" : "sticky",
      top: 0, padding: "1.5rem 0.75rem", backdropFilter: "blur(20px)", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 0.5rem", marginBottom: "2rem" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00f3ff" style={{ filter: "drop-shadow(0 0 5px #00f3ff)" }}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.1em", color: "#fff" }}>
          DRONE<span style={{ color: "#00f3ff" }}>KRAFT</span>
        </span>
      </div>
      <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4b5563", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", padding: "0 0.875rem" }}>ADMIN CONSOLE</p>
      <nav style={{ flex: 1, display: "flex", flexDirection: mobile ? "row" : "column", gap: "0.25rem", flexWrap: mobile ? "wrap" : "nowrap" }}>
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setSection(id); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 0.875rem", borderRadius: "0.75rem", width: mobile ? "auto" : "100%", background: section === id ? "rgba(0,243,255,0.08)" : "transparent", border: section === id ? "1px solid rgba(0,243,255,0.2)" : "1px solid transparent", color: section === id ? "#00f3ff" : "#6b7280", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-orbitron), monospace" }}>
            <Icon size={15} />{label}
          </button>
        ))}
      </nav>
      {!mobile && (
        <div style={{ marginTop: "auto", padding: "1rem", background: "rgba(0,243,255,0.03)", border: "1px solid rgba(0,243,255,0.1)", borderRadius: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "9999px", background: "#00f3ff", color: "#030810", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", fontFamily: "var(--font-orbitron), monospace" }}>{user.name.substring(0,2).toUpperCase()}</div>
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{user.name}</p>
              <p style={{ fontSize: "0.6rem", color: "#6b7280", display: "flex", alignItems: "center", gap: "0.25rem" }}><Zap size={10} color="#f59e0b" /> Administrator</p>
            </div>
          </div>
          <button onClick={async () => { await signOut(); router.push("/"); }} style={{ width: "100%", padding: "0.6rem", borderRadius: "9999px", background: "transparent", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-orbitron), monospace", transition: "0.2s" }}>Sign Out</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: "#030810", minHeight: "100vh", display: "flex" }}>
      <div style={{ display: "none" }} className="admin-sidebar-desktop"><Sidebar /></div>
      
      <div style={{ flex: 1, position: "relative", zIndex: 1, overflowX: "hidden" }}>
        <style>{`@media (min-width: 900px) { .admin-sidebar-desktop { display: flex !important; } .admin-mobile-topbar { display: none !important; } }`}</style>
        
        <div className="admin-mobile-topbar" style={{ display:"flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(0,243,255,0.08)", background: "rgba(0,10,22,0.9)", position: "sticky", top: 0, zIndex: 100 }}>
          <span style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.8rem", fontWeight: 900, color: "#fff" }}>DRONE<span style={{ color: "#00f3ff" }}>KRAFT</span></span>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "1px solid rgba(0,243,255,0.2)", borderRadius: "0.5rem", padding: "0.35rem 0.4rem", cursor: "pointer", color: "#00f3ff" }}><Menu size={18} /></button>
        </div>

        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#4b5563", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>COMMAND CENTER</p>
              <h1 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.8rem", fontWeight: 900, color: "#fff", textTransform: "uppercase" }}>{section}</h1>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={async () => { await signOut(); router.push("/"); }} style={{ padding: "0.5rem 1rem", borderRadius: "9999px", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", fontSize: "0.65rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase", cursor: "pointer" }}>Sign Out</button>
            </div>
          </div>

          {dataLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}><Loader2 size={32} className="text-cyan-400 animate-spin" /></div>
          ) : (
            <>
              {section === "overview" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    {kpis.map(({ icon: Icon, label, value, color, sub }) => (
                      <ACard key={label} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "0.5rem", background: `rgba(${color === "#22c55e" ? "34,197,94" : color === "#00f3ff" ? "0,243,255" : color === "#a78bfa" ? "167,139,250" : "245,158,11"},0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={18} color={color} />
                          </div>
                          {/* Mini Sparkline mock */}
                          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15L10 10L20 18L30 5L40 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.8rem", fontWeight: 900, color, lineHeight: 1, marginBottom: "0.4rem" }}>{value}</p>
                          <p style={{ fontSize: "0.6rem", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</p>
                          <p style={{ fontSize: "0.6rem", color, fontWeight: 600 }}>{sub}</p>
                        </div>
                      </ACard>
                    ))}
                  </div>

                  <ACard style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                      <h3 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.78rem", fontWeight: 700, color: "#00f3ff", textTransform: "uppercase" }}>Revenue - Last 7 Days</h3>
                      <span style={{ fontSize: "0.65rem", color: "#22c55e", fontWeight: 700 }}>₹{revenueData?.total_7_days?.toLocaleString() || '0'} total</span>
                    </div>
                    
                    {/* Dynamic Graph */}
                    <div style={{ position: "relative", height: "200px", width: "100%", padding: "1rem 0" }}>
                      {/* Grid lines */}
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{ position: "absolute", top: `${i * 25}%`, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.05)" }} />
                      ))}
                      
                      <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
                        {/* Gradient Fill */}
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(0,243,255,0.2)" />
                            <stop offset="100%" stopColor="rgba(0,243,255,0)" />
                          </linearGradient>
                        </defs>
                        
                        {revenueData?.chart_data?.length > 0 && (
                          <>
                            {/* Line Path Generation */}
                            {(() => {
                              const maxRev = Math.max(...revenueData.chart_data.map((d: any) => d.revenue), 10000) * 1.2;
                              const points = revenueData.chart_data.map((d: any, i: number) => {
                                const x = 50 + (i * 125); // distribute across 800px
                                const y = 180 - (d.revenue / maxRev * 150);
                                return { x, y, val: d.revenue };
                              });
                              
                              const pathD = points.reduce((acc: string, p: any, i: number) => 
                                i === 0 ? `M${p.x} ${p.y}` : `${acc} L${p.x} ${p.y}`, "");
                              
                              const fillD = `${pathD} L${points[points.length-1].x} 200 L${points[0].x} 200 Z`;

                              return (
                                <>
                                  <path d={fillD} fill="url(#chartGlow)" />
                                  <path d={pathD} stroke="#00f3ff" strokeWidth="4" fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(0,243,255,0.6))" }} />
                                  {points.map((pt: any, i: number) => (
                                    <g key={i}>
                                      <circle cx={pt.x} cy={pt.y} r="6" fill="#030810" stroke="#00f3ff" strokeWidth="3" />
                                      <text x={pt.x} y={pt.y - 15} fill="#9ca3af" fontSize="12" textAnchor="middle" fontWeight="bold">
                                        {pt.val > 1000 ? `${(pt.val/1000).toFixed(1)}k` : pt.val}
                                      </text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </>
                        )}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div style={{ position: "absolute", bottom: "-20px", left: 0, right: 0, display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: "0.65rem", padding: "0 40px" }}>
                        {revenueData?.chart_data?.map((d: any) => (
                          <span key={d.day} style={{ width: "50px", textAlign: "center" }}>{d.day}</span>
                        ))}
                      </div>
                    </div>
                  </ACard>

                  <ACard>
                    <h3 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.78rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", marginBottom: "1.25rem" }}>Pending Approvals</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {bookings.filter(b => b.status === "pending").map(b => (
                        <div key={b.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "rgba(245,158,11,0.05)", borderRadius: "0.875rem", border: "1px solid rgba(245,158,11,0.12)" }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, margin: "0 0 0.25rem" }}>{b.id.substring(0,8).toUpperCase()} <span style={{ color: "#00f3ff", marginLeft: "0.5rem" }}>{b.service_name || "Custom"}</span></p>
                            <p style={{ color: "#6b7280", fontSize: "0.75rem", margin: 0 }}>{b.location} · {b.mission_date}</p>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => updateBookingStatus(b.id, "confirmed")} style={{ padding: "0.35rem 0.75rem", borderRadius: "0.5rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.65rem", fontWeight: 700, border: "1px solid rgba(34,197,94,0.3)", cursor: "pointer" }}>Approve</button>
                            <button onClick={() => updateBookingStatus(b.id, "cancelled")} style={{ padding: "0.35rem 0.75rem", borderRadius: "0.5rem", background: "rgba(248,113,113,0.1)", color: "#f87171", fontSize: "0.65rem", fontWeight: 700, border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer" }}>Reject</button>
                          </div>
                        </div>
                      ))}
                      {bookings.filter(b => b.status === "pending").length === 0 && <p style={{ color: "#4b5563", fontSize: "0.8rem", textAlign: "center" }}>No pending requests.</p>}
                    </div>
                  </ACard>
                </div>
              )}

              {section === "bookings" && (
                <ACard>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(0,243,255,0.08)" }}>
                          {["ID","Service","Date","Location","Status","Amount","Assign Pilot","Actions"].map(h => (
                            <th key={h} style={{ padding: "0.875rem", textAlign: "left", fontSize: "0.58rem", letterSpacing: "0.1em", color: "#4b5563", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ padding: "0.875rem", fontSize: "0.65rem", color: "#00f3ff", fontFamily: "var(--font-orbitron), monospace" }}>{b.id.substring(0,8).toUpperCase()}</td>
                            <td style={{ padding: "0.875rem", fontSize: "0.75rem", color: "#e5e7eb", fontWeight: 600 }}>{b.service_name || "Custom"}</td>
                            <td style={{ padding: "0.875rem", fontSize: "0.72rem", color: "#e5e7eb" }}>{b.mission_date}</td>
                            <td style={{ padding: "0.875rem", fontSize: "0.68rem", color: "#9ca3af" }}>{b.location}</td>
                            <td style={{ padding: "0.875rem" }}><StatusBadge status={b.status} /></td>
                            <td style={{ padding: "0.875rem", fontSize: "0.72rem", color: "#e5e7eb" }}>₹{(b.total_amount ?? b.amount)?.toLocaleString() || "—"}</td>
                            <td style={{ padding: "0.875rem" }}>
                              {b.pilot_id ? (
                                <span style={{ fontSize: "0.6rem", color: "#22c55e", fontWeight: 700 }}>✓ Assigned</span>
                              ) : b.status === "confirmed" ? (
                                assigningId === b.id ? (
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                    <select
                                      defaultValue=""
                                      onChange={e => { if (e.target.value) handleAssignPilot(b.id, e.target.value); }}
                                      style={{ background: "#030810", border: "1px solid rgba(0,243,255,0.2)", color: "#e5e7eb", borderRadius: "0.4rem", padding: "0.3rem", fontSize: "0.65rem", cursor: "pointer" }}
                                    >
                                      <option value="" disabled>Select pilot…</option>
                                      {pilots.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    <button onClick={() => setAssigningId(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.7rem" }}>✕</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setAssigningId(b.id)} style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", background: "rgba(167,139,250,0.1)", color: "#a78bfa", fontSize: "0.62rem", fontWeight: 700, border: "1px solid rgba(167,139,250,0.25)", cursor: "pointer", whiteSpace: "nowrap" }}>Assign Pilot</button>
                                )
                              ) : (
                                <span style={{ fontSize: "0.6rem", color: "#4b5563" }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: "0.875rem" }}>
                              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                {b.status === "pending" && (
                                  <>
                                    <button onClick={() => updateBookingStatus(b.id, "confirmed")} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.4rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", fontSize: "0.58rem", fontWeight: 700, border: "1px solid rgba(34,197,94,0.3)", cursor: "pointer" }}>✓ Approve</button>
                                    <button onClick={() => updateBookingStatus(b.id, "cancelled")} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.4rem", background: "rgba(248,113,113,0.1)", color: "#f87171", fontSize: "0.58rem", fontWeight: 700, border: "1px solid rgba(248,113,113,0.3)", cursor: "pointer" }}>✕ Reject</button>
                                  </>
                                )}
                                {b.status === "active" && (
                                  <button onClick={() => updateBookingStatus(b.id, "completed")} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.4rem", background: "rgba(0,243,255,0.1)", color: "#00f3ff", fontSize: "0.58rem", fontWeight: 700, border: "1px solid rgba(0,243,255,0.25)", cursor: "pointer" }}>Mark Done</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ACard>
              )}

              {section === "pilots" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "0.8rem", fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>Registered Pilots</h3>
                    <button onClick={() => setShowPilotForm(!showPilotForm)} className="btn-neon-solid" style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.65rem", fontWeight: 700 }}>
                      {showPilotForm ? "Cancel" : "+ Create Pilot"}
                    </button>
                  </div>

                  {showPilotForm && (
                    <ACard style={{ marginBottom: "2rem", border: "1px solid rgba(0,243,255,0.3)" }}>
                      <form onSubmit={handleCreatePilot} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <label style={{ fontSize: "0.6rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>Full Name</label>
                          <input type="text" required className="input-neon" style={{ padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.8rem" }} value={newPilot.full_name} onChange={e => setNewPilot({...newPilot, full_name: e.target.value})} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <label style={{ fontSize: "0.6rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>Email</label>
                          <input type="email" required className="input-neon" style={{ padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.8rem" }} value={newPilot.email} onChange={e => setNewPilot({...newPilot, email: e.target.value})} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <label style={{ fontSize: "0.6rem", color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>Password</label>
                          <input type="password" required className="input-neon" style={{ padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.8rem" }} value={newPilot.password} onChange={e => setNewPilot({...newPilot, password: e.target.value})} />
                        </div>
                        <button type="submit" disabled={formLoading} className="btn-neon-solid" style={{ padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.7rem" }}>
                          {formLoading ? <Loader2 size={16} className="animate-spin" /> : "Deploy Pilot"}
                        </button>
                      </form>
                    </ACard>
                  )}

                  <ACard>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
                      {pilots.map(p => (
                        <div key={p.id} style={{ background: "rgba(0,243,255,0.03)", border: "1px solid rgba(0,243,255,0.08)", borderRadius: "1rem", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #00f3ff, #0088ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#030810", fontSize: "1.2rem" }}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontWeight: 700, margin: 0 }}>{p.name}</p>
                            <p style={{ color: "#00f3ff", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.25rem" }}>{p.status}</p>
                          </div>
                        </div>
                      ))}
                      {pilots.length === 0 && <p style={{ color: "#4b5563", fontSize: "0.8rem", textAlign: "center", gridColumn: "1/-1" }}>No pilots found.</p>}
                    </div>
                  </ACard>
                </div>
              )}

              {section === "services" && (
                <ACard>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {services.map(s => (
                      <div key={s.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "1rem", padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <h4 style={{ color: "#00f3ff", fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>{s.name}</h4>
                          <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 700 }}>₹{s.base_price?.toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "#6b7280", lineHeight: 1.4, margin: 0 }}>{s.description}</p>
                      </div>
                    ))}
                  </div>
                </ACard>
              )}

              {section === "settings" && (
                <ACard>
                  <p style={{ color: "#4b5563", fontSize: "0.8rem", textAlign: "center" }}>System settings coming soon.</p>
                </ACard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

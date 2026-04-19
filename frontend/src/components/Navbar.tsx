"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthContext";
import { useNotifications } from "@/components/NotificationContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Shield, Menu, X, Loader2, Bell } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { user, signIn, signUp, signInWithGoogle, signOut, isAdmin, isLoggedIn } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/#stats",    label: "About"    },
    { href: "/#contact",  label: "Book Now" },
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
        setDropdownOpen(false);
      }
    } catch (err: any) {
      alert(err?.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
        }

        .nav-link {
          position: relative;
          color: #9ca3af;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: #00f3ff;
          box-shadow: 0 0 6px #00f3ff;
          transition: width 0.3s;
        }
        .nav-link:hover { color: #00f3ff; }
        .nav-link:hover::after { width: 100%; }

        /* ── Avatar Pill ── */
        .avatar-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          border-radius: 9999px;
          background: rgba(0,243,255,0.08);
          border: 1px solid rgba(0,243,255,0.2);
          cursor: pointer;
          transition: all 0.25s;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
        }
        .avatar-pill:hover {
          background: rgba(0,243,255,0.14);
          border-color: rgba(0,243,255,0.4);
        }

        /* ── Avatar Circle ── */
        .avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #00f3ff, #0088ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 900;
          color: #030810;
          font-family: var(--font-orbitron), monospace;
          flex-shrink: 0;
        }

        /* ── Dropdown Panel ── */
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 0.75rem);
          right: 0;
          min-width: 220px;
          background: rgba(3,8,16,0.98);
          border: 1px solid rgba(0,243,255,0.2);
          border-radius: 1rem;
          padding: 0.5rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.8);
          z-index: 200;
          backdrop-filter: blur(20px);
        }

        /* ── Dropdown Item ── */
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.625rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .dropdown-item:hover { background: rgba(0,243,255,0.08); color: #00f3ff; }

        /* ── Auth Input ── */
        .input-auth {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          color: #fff;
          font-size: 0.8rem;
          width: 100%;
          outline: none;
          transition: border-color 0.3s;
        }
        .input-auth::placeholder { color: rgba(255,255,255,0.3); }
        .input-auth:focus { border-color: #00f3ff; box-shadow: 0 0 0 2px rgba(0,243,255,0.1); }

        /* ── Notification Bell ── */
        .notif-bell {
          position: relative;
          padding: 0.5rem;
          border-radius: 9999px;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.25s;
          border: 1px solid transparent;
          background: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notif-bell:hover {
          color: #00f3ff;
          background: rgba(0,243,255,0.06);
          border-color: rgba(0,243,255,0.15);
        }

        /* ── Notification Badge ── */
        .notif-badge {
          position: absolute;
          top: 2px; right: 2px;
          width: 16px; height: 16px;
          border-radius: 9999px;
          background: #f87171;
          color: #fff;
          font-size: 0.5rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #030810;
          box-shadow: 0 0 8px rgba(248,113,113,0.5);
        }

        /* ── Notification Item ── */
        .notif-item {
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .notif-item:hover { background: rgba(0,243,255,0.04); border-color: rgba(0,243,255,0.1); }
        .notif-unread { background: rgba(0,243,255,0.05); border-color: rgba(0,243,255,0.08) !important; }

        /* ── Unread dot ── */
        .unread-dot {
          position: absolute;
          top: 0.875rem; right: 0.75rem;
          width: 6px; height: 6px;
          border-radius: 9999px;
          background: #00f3ff;
          box-shadow: 0 0 6px rgba(0,243,255,0.9);
        }

        /* ── Custom scrollbar ── */
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,243,255,0.2); border-radius: 10px; }

        /* ── Google Sign In button ── */
        .btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.6rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #e5e7eb;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-google:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        /* ── Mobile drawer ── */
        .nav-mobile-drawer {
          border-top: 1px solid rgba(0,243,255,0.08);
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(3,8,16,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,243,255,0.12)" : "1px solid transparent",
        padding: scrolled ? "0.65rem 0" : "1.25rem 0",
      }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f3ff" style={{ filter: "drop-shadow(0 0 6px rgba(0,243,255,0.6))" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.1rem", fontWeight: 900, color: "#fff", letterSpacing: "0.05em" }}>
              DRONE<span style={{ color: "#00f3ff" }}>KRAFT</span>
            </span>
          </Link>

          {/* Nav Links & Auth */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: "1.5rem" }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="nav-link" style={{ color: "#00f3ff" }}>Admin</Link>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

              {/* Notification Bell */}
              {isLoggedIn && (
                <div style={{ position: "relative" }} ref={notifRef}>
                  <button className="notif-bell" onClick={() => setNotifOpen(v => !v)} aria-label="Notifications">
                    <Bell size={18} />
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                  </button>

                  {notifOpen && (
                    <div className="nav-dropdown" style={{ minWidth: "300px", padding: "1rem", right: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
                        <h3 style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: "#00f3ff", textTransform: "uppercase", margin: 0 }}>Notifications</h3>
                        <button onClick={markAllRead} style={{ fontSize: "0.6rem", color: "#6b7280", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                          Mark all read
                        </button>
                      </div>
                      <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }} className="custom-scrollbar">
                        {notifications.length === 0 ? (
                          <p style={{ textAlign: "center", color: "#4b5563", fontSize: "0.72rem", padding: "2rem 0" }}>No notifications yet.</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`notif-item${n.is_unread ? " notif-unread" : ""}`} onClick={() => markAsRead(n.id)}>
                              <div style={{ display: "flex", gap: "0.625rem" }}>
                                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{n.icon || "🚁"}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: n.is_unread ? "#fff" : "#9ca3af", marginBottom: "0.15rem", margin: "0 0 0.15rem" }}>{n.title}</p>
                                  <p style={{ fontSize: "0.65rem", color: "#6b7280", lineHeight: 1.4, margin: 0 }}>{n.description}</p>
                                  <p style={{ fontSize: "0.56rem", color: "#374151", marginTop: "0.3rem", margin: "0.3rem 0 0" }}>
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </p>
                                </div>
                              </div>
                              {n.is_unread && <span className="unread-dot" />}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Auth Controls */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button id="nav-avatar-btn" className="avatar-pill" onClick={() => setDropdownOpen(v => !v)}>
                      <span className="avatar-circle">{user?.avatar}</span>
                      <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user?.name.split(" ")[0]}
                      </span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, opacity: 0.6 }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="nav-dropdown">
                        <div style={{ padding: "0.625rem 0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "0.375rem" }}>
                          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", margin: "0 0 0.15rem" }}>{user?.name}</p>
                          <p style={{ fontSize: "0.6rem", color: "#6b7280", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{user?.role}</p>
                        </div>
                        <Link href={isAdmin ? "/admin" : (user?.role === "pilot" ? "/pilot" : "/dashboard")} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <User size={14} /> {isAdmin ? "Admin Panel" : (user?.role === "pilot" ? "Pilot Console" : "Dashboard")}
                        </Link>
                        <button className="dropdown-item" style={{ color: "#f87171" }} onClick={handleSignOut}>
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <button 
                      onClick={() => signInWithGoogle()}
                      className="nav-link"
                      style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </button>
                    <button
                      className="btn-neon"
                      style={{ padding: "0.45rem 1.1rem", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}
                      onClick={() => setDropdownOpen(v => !v)}
                    >
                      LOGIN
                    </button>

                    {dropdownOpen && (
                      <div className="nav-dropdown" style={{ padding: "1.25rem", minWidth: "260px" }}>
                        <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#00f3ff", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
                          {isSignUp ? "Create Account" : "Welcome Back"}
                        </p>
                        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                          {isSignUp && <input type="text" placeholder="Full Name" required className="input-auth" value={fullName} onChange={e => setFullName(e.target.value)} />}
                          <input type="email" placeholder="Email" required className="input-auth" value={email} onChange={e => setEmail(e.target.value)} />
                          <input type="password" placeholder="Password" required className="input-auth" value={password} onChange={e => setPassword(e.target.value)} />
                          <button type="submit" disabled={authLoading} className="btn-neon-solid" style={{ width: "100%", padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.7rem" }}>
                            {authLoading ? <Loader2 size={14} className="animate-spin" /> : (isSignUp ? "Join" : "Login")}
                          </button>
                        </form>
                        <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "0.6rem", marginTop: "0.75rem", cursor: "pointer", width: "100%" }}>
                          {isSignUp ? "Already a member? Login" : "New? Create account"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </nav>
    </>
  );
}

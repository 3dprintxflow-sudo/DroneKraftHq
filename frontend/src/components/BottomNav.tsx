"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Layers, Calendar, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isLoggedIn, isAdmin } = useAuth();
  const [active, setActive] = useState<string>("home");
  const [showLogin, setShowLogin] = useState(false);
  const resolvedActive =
    pathname === "/dashboard" || pathname === "/admin" ? "dashboard" : active;

  // Track active section via scroll (only on home page)
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = ["contact", "services", "stats"];
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 200) { setActive("home"); return; }
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 120;
          const bot = top + el.offsetHeight;
          if (scrollY >= top && scrollY < bot) {
            setActive(id === "contact" ? "book" : id === "services" ? "services" : "home");
            return;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const navItems = [
    { id: "home",     label: "Home",     href: "/",         icon: Home     },
    { id: "services", label: "Services", href: "/#services", icon: Layers   },
    { id: "book",     label: "Book",     href: "/#contact",  icon: Calendar },
  ];

  const openSignIn = () => {
    setShowLogin(false);
    setActive("home");
    router.push("/");
  };

  return (
    <>
      <style>{`
        /* ── Bottom Nav Shell ── */
        .bnav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 0 1rem calc(0.75rem + env(safe-area-inset-bottom)) 1rem;
          pointer-events: none;
        }

        .bnav-inner {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: rgba(2, 6, 14, 0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          padding: 0.6rem 1rem;
          box-shadow:
            0 -2px 40px rgba(0, 0, 0, 0.6),
            0 0 0 0.5px rgba(0,243,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.06);
          pointer-events: all;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
        }

        /* ── Nav Item ── */
        .bnav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
          position: relative;
          padding: 0.4rem 0.75rem;
          min-width: 60px;
          border-radius: 0.75rem;
          border: none;
          background: none;
          cursor: pointer;
        }
        .bnav-item.is-active { color: #ffffff; }
        .bnav-item:not(.is-active):hover { color: rgba(255,255,255,0.65); transform: translateY(-2px); }

        /* ── Active pill background ── */
        .bnav-item.is-active::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, rgba(0,243,255,0.15), rgba(0,136,255,0.1));
          border: 1px solid rgba(0,243,255,0.2);
          animation: pill-in 0.3s ease forwards;
        }
        @keyframes pill-in {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ── Active dot indicator ── */
        .bnav-item.is-active::after {
          content: '';
          position: absolute;
          bottom: -0.35rem;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #00f3ff;
          box-shadow: 0 0 8px rgba(0,243,255,0.8);
        }

        /* ── Icon glow on active ── */
        .bnav-item.is-active .bnav-icon {
          filter: drop-shadow(0 0 6px rgba(0,243,255,0.7));
          color: #00f3ff;
        }
        .bnav-icon { transition: filter 0.25s ease, color 0.25s ease; position: relative; z-index: 1; }

        /* ── Label ── */
        .bnav-label {
          font-family: var(--font-orbitron), monospace;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          line-height: 1;
        }
        .bnav-item.is-active .bnav-label { color: #ffffff; text-shadow: 0 0 10px rgba(0,243,255,0.4); }

        /* ── Profile button ── */
        .bnav-profile { position: relative; }

        /* ── Login Popup ── */
        .bnav-popup {
          position: absolute;
          bottom: calc(100% + 1rem);
          right: 0;
          width: clamp(200px, 80vw, 280px);
          background: rgba(2, 6, 20, 0.97);
          border: 1px solid rgba(0,243,255,0.2);
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(0,243,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: popup-rise 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
          z-index: 10000;
        }
        @keyframes popup-rise {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bnav-popup-title {
          font-family: var(--font-orbitron), monospace;
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.25em;
          color: #00f3ff;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px rgba(0,243,255,0.5);
        }
        .bnav-popup-sub {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.35);
          text-align: center;
          margin-bottom: 1rem;
          font-family: var(--font-orbitron), monospace;
          letter-spacing: 0.05em;
        }
        .bnav-role-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.65rem 0.875rem;
          border-radius: 0.625rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: rgba(0,243,255,0.05);
          border: 1px solid rgba(0,243,255,0.12);
          color: #e5e7eb;
          cursor: pointer;
          margin-bottom: 0.5rem;
          transition: all 0.25s;
          text-align: left;
          font-family: var(--font-orbitron), monospace;
        }
        .bnav-role-btn:last-child { margin-bottom: 0; }
        .bnav-role-btn:hover { background: rgba(0,243,255,0.12); border-color: rgba(0,243,255,0.3); color: #00f3ff; }
        .bnav-role-icon {
          width: 30px; height: 30px;
          border-radius: 0.5rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; flex-shrink: 0;
        }
        .bnav-logout-btn {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(248,113,113,0.3);
          background: transparent;
          color: #f87171;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: var(--font-orbitron), monospace;
          transition: background 0.2s, color 0.2s;
          margin-top: 0.5rem;
        }
        .bnav-logout-btn:hover { background: rgba(248,113,113,0.08); }
        .bnav-avatar-mini {
          width: 20px; height: 20px;
          border-radius: 9999px;
          background: linear-gradient(135deg,#00f3ff,#0088ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.45rem; font-weight: 900;
          color: #030810;
          font-family: var(--font-orbitron), monospace;
          position: relative; z-index: 1;
        }
        .popup-user-bar {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.5rem 0.625rem; border-radius: 0.625rem;
          background: rgba(0,243,255,0.06);
          border: 1px solid rgba(0,243,255,0.1);
          margin-bottom: 0.75rem;
        }
        .popup-dash-btn {
          display: block;
          width: 100%;
          padding: 0.65rem;
          text-align: center;
          border-radius: 0.625rem;
          background: linear-gradient(135deg,#00f3ff,#0088ff);
          color: #030810;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: var(--font-orbitron), monospace;
          margin-bottom: 0.5rem;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .popup-dash-btn:hover { opacity: 0.85; }
      `}</style>

      <nav className="bnav" aria-label="Bottom navigation">
        <div className="bnav-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = resolvedActive === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`bnav-item${isActive ? " is-active" : ""}`}
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} className="bnav-icon" />
                <span className="bnav-label">{item.label}</span>
              </Link>
            );
          })}

          {/* Profile / Dashboard */}
          <div className="bnav-profile">
            <button
              className={`bnav-item${resolvedActive === "dashboard" ? " is-active" : ""}`}
              onClick={() => setShowLogin((p) => !p)}
              aria-label="Profile / Dashboard"
            >
              {isLoggedIn ? (
                <span className="bnav-avatar-mini">{user!.avatar}</span>
              ) : (
                <User size={20} strokeWidth={resolvedActive === "dashboard" ? 2.5 : 1.75} className="bnav-icon" />
              )}
              <span className="bnav-label">{isLoggedIn ? "Me" : "Profile"}</span>
            </button>

            {showLogin && (
              <div className="bnav-popup">
                {isLoggedIn ? (
                  /* ── Logged-in popup ── */
                  <>
                    <div className="popup-user-bar">
                      <div className="bnav-avatar-mini" style={{ width: 32, height: 32, fontSize: "0.6rem" }}>{user!.avatar}</div>
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{user!.name}</p>
                        <p style={{ fontSize: "0.6rem", color: "#6b7280" }}>{user!.role === "admin" ? "⚡ Admin" : `🏅 ${user!.tier}`}</p>
                      </div>
                    </div>
                    <Link
                      href={isAdmin ? "/admin" : user!.role === "pilot" ? "/pilot" : "/dashboard"}
                      className="popup-dash-btn"
                      onClick={() => { setShowLogin(false); setActive("dashboard"); }}
                    >
                      {isAdmin ? "Admin Panel" : user!.role === "pilot" ? "Pilot Console" : "My Dashboard"}
                    </Link>
                    <button
                      className="bnav-logout-btn"
                      onClick={async () => {
                        await signOut();
                        setShowLogin(false);
                        setActive("home");
                        router.push("/");
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  /* ── Guest popup ── */
                  <>
                    <p className="bnav-popup-title">Access Portal</p>
                    <p className="bnav-popup-sub">Open the home page to sign in with email or Google.</p>
                    <button className="bnav-role-btn" onClick={openSignIn}>
                      <span className="bnav-role-icon" style={{ background: "rgba(0,243,255,0.12)" }}>👤</span>
                      <div>
                        <div>Open Sign In</div>
                        <div style={{ fontSize: "0.55rem", color: "#6b7280", fontWeight: 400 }}>Access your dashboard</div>
                      </div>
                    </button>
                    <button className="bnav-role-btn" onClick={() => { setShowLogin(false); setActive("book"); router.push("/#contact"); }}>
                      <span className="bnav-role-icon" style={{ background: "rgba(255,100,0,0.12)" }}>⚡</span>
                      <div>
                        <div>Book a Mission</div>
                        <div style={{ fontSize: "0.55rem", color: "#6b7280", fontWeight: 400 }}>Jump to the booking section</div>
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

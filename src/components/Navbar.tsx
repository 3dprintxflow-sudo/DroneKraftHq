"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#services",  label: "Services"  },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#stats",     label: "About"     },
  ];

  return (
    <>
      <style>{`
        .nav-desktop { display: none; }
        .nav-hamburger { display: flex; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
          .nav-hamburger { display: none; }
          .nav-mobile-drawer { display: none !important; }
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
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #00f3ff;
          box-shadow: 0 0 6px #00f3ff;
          transition: width 0.3s;
        }
        .nav-link:hover { color: #00f3ff; }
        .nav-link:hover::after { width: 100%; }
        
        .btn-google-nav {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .btn-google-nav:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.4s ease",
          background: scrolled ? "rgba(3,8,16,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,243,255,0.15)" : "1px solid transparent",
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00f3ff" style={{ filter: "drop-shadow(0 0 6px #00f3ff)" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                fontSize: "1.2rem",
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: "#fff",
              }}
            >
              DRONE<span style={{ color: "#00f3ff", textShadow: "0 0 10px rgba(0,243,255,0.7)" }}>KRAFT</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: "2rem" }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1rem" }}>
              <button className="btn-google-nav" onClick={() => alert("Google Login mock triggered!")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign In
              </button>

              <Link
                id="nav-book-now"
                href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid #00f3ff",
                color: "#00f3ff",
                fontSize: "0.7rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "#00f3ff";
                el.style.color = "#030810";
                el.style.boxShadow = "0 0 24px rgba(0,243,255,0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                el.style.color = "#00f3ff";
                el.style.boxShadow = "none";
              }}
            >
              Book Now
            </Link>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            style={{
              color: "#00f3ff",
              background: "transparent",
              border: "1px solid rgba(0,243,255,0.2)",
              borderRadius: "0.5rem",
              padding: "0.4rem 0.5rem",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isOpen ? (
              <svg width="20" height="20" fill="none" stroke="#00f3ff" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="#00f3ff" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {isOpen && (
          <div
            className="nav-mobile-drawer"
            style={{
              background: "rgba(3,8,16,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(0,243,255,0.12)",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#9ca3af",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
            
            <button 
              className="btn-google-nav" 
              style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "0.8rem", marginTop: "1rem" }}
              onClick={() => alert("Google Login mock triggered!")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign In with Google
            </button>

            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #00f3ff, #0088ff)",
                color: "#030810",
                fontSize: "0.75rem",
                fontWeight: 900,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Book Now
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
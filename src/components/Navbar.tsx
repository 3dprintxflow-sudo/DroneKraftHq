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
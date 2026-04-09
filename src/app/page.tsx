"use client";
import { motion } from "framer-motion";
import {
  Camera, Map, Shield, GraduationCap,
  ArrowRight, MessageCircle, ChevronDown,
  TrendingUp, Users, Award, Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

/* ── Data ── */
const STATS = [
  { icon: TrendingUp, value: "500+",  label: "Missions Flown"   },
  { icon: Users,      value: "200+",  label: "Pilots Certified" },
  { icon: Award,      value: "98%",   label: "Client Rating"    },
  { icon: Zap,        value: "24hrs", label: "Response Time"    },
];

const SERVICES = [
  { icon: Camera,        title: "Cinematography",   desc: "8K RAW footage for films, ads, real estate & events. Every frame precision-crafted.", tag: "Creative"   },
  { icon: Map,           title: "Mapping & Survey", desc: "Lidar & photogrammetry for construction, agriculture, and infrastructure projects.",   tag: "Precision"  },
  { icon: Shield,        title: "Inspections",      desc: "Thermal imaging and structural analysis for towers, solar farms, and pipelines.",      tag: "Safety"     },
  { icon: GraduationCap, title: "Training Academy", desc: "DGCA-compliant pilot certification with hands-on flight simulators and live drills.",   tag: "Education"  },
];

/* ── Layout CSS injected once ── */
const layoutCSS = `
  .hero-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .hero-buttons a {
    width: 100%;
    max-width: 22rem;
  }
  @media (min-width: 600px) {
    .hero-buttons {
      flex-direction: row;
    }
    .hero-buttons a {
      width: auto;
      max-width: none;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  @media (min-width: 768px) {
    .stats-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 640px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .services-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .service-card {
    background: rgba(0,243,255,0.04);
    border: 1px solid rgba(0,243,255,0.1);
    border-radius: 1rem;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    cursor: default;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .service-card:hover {
    border-color: rgba(0,243,255,0.4);
    box-shadow: 0 0 30px rgba(0,243,255,0.12);
  }
  .service-card:hover .card-icon {
    filter: drop-shadow(0 0 8px rgba(0,243,255,0.8));
  }
  .card-icon { color: #00f3ff; transition: filter 0.3s; }
  .card-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(0,243,255,0.6);
    background: rgba(0,243,255,0.1);
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    width: fit-content;
  }
  .card-title {
    font-family: var(--font-orbitron), monospace;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #fff;
  }
  .card-desc {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.6;
    flex: 1;
  }
  .card-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #00f3ff;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    transition: gap 0.3s;
    padding: 0;
  }
  .service-card:hover .card-cta { gap: 0.75rem; }
`;

export default function Home() {
  return (
    <main style={{ background: "#030810", minHeight: "100vh" }}>
      <style>{layoutCSS}</style>
      <Navbar />

      {/* ════════════════ HERO ════════════════ */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Cyber grid */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(0,243,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.06) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: 0.6,
          }}
        />
        {/* Radial glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(0,243,255,0.07) 0%, transparent 70%)" }} />
        {/* BG image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(3,8,16,0.6), rgba(3,8,16,0.5), #030810)", zIndex: 1 }} />
          <img
            src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070"
            alt="Drone aerial background"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }}
          />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 1.5rem", maxWidth: "72rem", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
          >
            <span style={{ height: "1px", width: "4rem", background: "rgba(0,243,255,0.5)" }} />
            <span className="section-label">Professional UAV Solutions</span>
            <span style={{ height: "1px", width: "4rem", background: "rgba(0,243,255,0.5)" }} />
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            THE SKY IS<br />
            <span className="gradient-text">NO LONGER</span><br />
            THE LIMIT
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ color: "#9ca3af", maxWidth: "36rem", margin: "0 auto 2.5rem", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", lineHeight: 1.7 }}
          >
            Aerial intelligence, cinema-grade videography & DGCA certified training — all under one roof.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hero-buttons"
          >
            <a
              id="hero-launch-btn"
              href="#contact"
              className="btn-neon-solid"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem 2.5rem",
                borderRadius: "9999px",
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Launch Mission
            </a>
            <a
              id="hero-courses-btn"
              href="#services"
              className="btn-neon"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem 2.5rem",
                borderRadius: "9999px",
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <span>Explore Services</span>
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{
            position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
            zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem",
          }}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(0,243,255,0.5)", fontFamily: "monospace" }}>Scroll</span>
          <ChevronDown size={18} color="rgba(0,243,255,0.5)" className="animate-bounce" />
        </motion.div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section
        id="stats"
        style={{
          borderTop: "1px solid rgba(0,243,255,0.1)",
          borderBottom: "1px solid rgba(0,243,255,0.1)",
          background: "rgba(6,15,28,0.7)",
          backdropFilter: "blur(12px)",
          padding: "2.5rem 1.5rem",
          position: "relative",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="stats-grid"
          style={{ maxWidth: "64rem", margin: "0 auto" }}
        >
          {STATS.map(({ icon: Icon, value, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}
            >
              <Icon size={20} color="rgba(0,243,255,0.55)" />
              <span className="stat-value" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900 }}>{value}</span>
              <span style={{ color: "#6b7280", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════ SERVICES ════════════════ */}
      <section id="services" style={{ padding: "7rem 1.5rem", maxWidth: "80rem", margin: "0 auto" }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
          {/* Header */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", gap: "1.5rem", flexWrap: "wrap" }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: "0.75rem" }}>Specialized Solutions</p>
              <h2
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                }}
              >
                Our<br /><span className="gradient-text">Capabilities</span>
              </h2>
            </div>
            <p style={{ color: "#6b7280", maxWidth: "22rem", fontSize: "0.85rem", lineHeight: 1.7 }}>
              Equipped with the latest UAV technology to deliver precision data and stunning visuals from above.
            </p>
          </motion.div>

          {/* Cards */}
          <div className="services-grid">
            {SERVICES.map(({ icon: Icon, title, desc, tag }) => (
              <motion.div key={title} variants={fadeUp} className="service-card">
                <span className="card-tag">{tag}</span>
                <Icon size={36} strokeWidth={1.5} className="card-icon" />
                <div>
                  <p className="card-title" style={{ marginBottom: "0.5rem" }}>{title}</p>
                  <p className="card-desc">{desc}</p>
                </div>
                <button className="card-cta" id={`service-${title.toLowerCase().replace(/[\s&]+/g, "-")}`}>
                  Learn More <ArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════════════ CTA BANNER ════════════════ */}
      <section style={{ padding: "6rem 1.5rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,243,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,243,255,0.04) 1px,transparent 1px)", backgroundSize: "50px 50px", opacity: 0.4 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,243,255,0.06) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "50rem", margin: "0 auto", position: "relative" }}
        >
          <p className="section-label" style={{ marginBottom: "1rem" }}>Ready for Takeoff?</p>
          <h2
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Elevate Your<br /><span className="gradient-text">Next Project</span>
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", maxWidth: "32rem", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            From single-day shoots to multi-week infrastructure surveys, our team is ready to deploy within 24 hours.
          </p>
          <a
            id="cta-contact-btn"
            href="#contact"
            className="btn-neon-solid"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              fontWeight: 900,
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Get a Free Quote <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>

      {/* ════════════════ BOOKING FORM ════════════════ */}
      <BookingForm />

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(0,243,255,0.10)", background: "rgba(3,8,16,0.95)", padding: "4rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

          {/* Top row — 3 columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
            alignItems: "start",
          }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#00f3ff" style={{ filter: "drop-shadow(0 0 5px #00f3ff)" }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.12em", color: "#fff" }}>
                  DRONE<span style={{ color: "#00f3ff", textShadow: "0 0 8px rgba(0,243,255,0.7)" }}>KRAFT</span>
                </span>
              </div>
              <p style={{ color: "#4b5563", fontSize: "0.78rem", lineHeight: 1.7, maxWidth: "18rem" }}>
                Professional UAV services & DGCA certified pilot training. Elevating perspectives from above.
              </p>
            </div>

            {/* Social */}
            <div>
              <p style={{ color: "#00f3ff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "var(--font-orbitron), monospace" }}>
                Follow Us
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {/* Instagram */}
                <a
                  href="https://instagram.com/dronekrafthq"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-instagram"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", color: "#9ca3af", textDecoration: "none", fontSize: "0.82rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#00f3ff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                >
                  {/* Instagram icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  @dronekrafthq
                </a>
                {/* Twitter / X */}
                <a
                  href="https://twitter.com/dronekrafthq"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-twitter"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", color: "#9ca3af", textDecoration: "none", fontSize: "0.82rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#00f3ff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                >
                  {/* X icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                  </svg>
                  @dronekrafthq
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com/@dronekrafthq"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="footer-youtube"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", color: "#9ca3af", textDecoration: "none", fontSize: "0.82rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#00f3ff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                >
                  {/* YouTube icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.5 5 12 5 12 5s-4.5 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.5 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5v-5.5l5.5 2.8-5.5 2.7z"/>
                  </svg>
                  @dronekrafthq
                </a>
              </div>
            </div>

            {/* Address */}
            <div>
              <p style={{ color: "#00f3ff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem", fontFamily: "var(--font-orbitron), monospace" }}>
                Location
              </p>
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                {/* Map pin icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p style={{ color: "#e5e7eb", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.2rem" }}>Bristol IT Park</p>
                  <p style={{ color: "#6b7280", fontSize: "0.8rem", lineHeight: 1.6 }}>Chennai, Tamil Nadu<br />India</p>
                </div>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,243,255,0.25), transparent)", marginBottom: "1.5rem" }} />

          {/* Bottom row */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
            <p style={{ color: "#374151", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              © {new Date().getFullYear()} DroneKraft — All Rights Reserved
            </p>
            <p style={{ color: "#374151", fontSize: "0.68rem", letterSpacing: "0.15em" }}>
              Crafted with precision ⚡
            </p>
          </div>

        </div>
      </footer>

      {/* ════════════════ WHATSAPP FLOAT ════════════════ */}
      <a
        id="whatsapp-float"
        href="https://wa.me/1234567890?text=I'm%20interested%20in%20Dronekraft%20services"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 100,
          background: "#22c55e", padding: "1rem", borderRadius: "9999px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", textDecoration: "none",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        <MessageCircle size={26} />
        <span style={{
          position: "absolute", top: "-2px", right: "-2px",
          width: "0.6rem", height: "0.6rem",
          background: "#86efac", borderRadius: "9999px",
          border: "2px solid #030810",
        }} />
      </a>
    </main>
  );
}
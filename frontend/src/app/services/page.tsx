"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, ArrowRight, Loader2, Zap, Shield, Map, GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import * as LucideIcons from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <main style={{ background: "#030810", minHeight: "100vh", paddingBottom: "8rem" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: "relative", paddingTop: "10rem", paddingBottom: "6rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(0,243,255,0.05) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "60rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#00f3ff", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Professional UAV Catalog
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "2rem" }}>
            Aerial <span style={{ color: "#00f3ff" }}>Intelligence</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ color: "#6b7280", fontSize: "1.1rem", maxWidth: "36rem", margin: "0 auto", lineHeight: 1.7 }}>
            Explore our specialized drone solutions tailored for industrial, creative, and tactical applications.
          </motion.p>
        </div>
      </section>

      {/* Services List */}
      <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "6rem" }}>
            <Loader2 size={40} className="text-cyan-400 animate-spin" />
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {services.map((s) => {
              const IconComponent = (LucideIcons as any)[s.icon_name] || Camera;
              return (
                <motion.div
                  key={s.id}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  style={{
                    background: "rgba(0,243,255,0.02)",
                    border: "1px solid rgba(0,243,255,0.1)",
                    borderRadius: "1.5rem",
                    padding: "2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: "radial-gradient(circle at 100% 0%, rgba(0,243,255,0.08) 0%, transparent 70%)" }} />
                  
                  <div style={{ width: 56, height: 56, borderRadius: "1rem", background: "rgba(0,243,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00f3ff" }}>
                    <IconComponent size={28} />
                  </div>

                  <div>
                    <h3 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>{s.name}</h3>
                    <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{s.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#00f3ff", letterSpacing: "0.1em" }}>
                        STARTING AT ₹{s.base_price?.toLocaleString()}
                      </span>
                      <a href="/#contact" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase" }}>
                        Book Now <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {services.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "6rem", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "2rem" }}>
                <p style={{ color: "#4b5563" }}>Our mission catalog is currently being updated. Please check back shortly.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* CTA */}
      <section style={{ marginTop: "8rem", padding: "6rem 1.5rem", textAlign: "center", background: "rgba(0,243,255,0.02)", borderTop: "1px solid rgba(0,243,255,0.05)" }}>
        <h2 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: "1.5rem" }}>
          NOT FINDING WHAT <span style={{ color: "#00f3ff" }}>YOU NEED?</span>
        </h2>
        <p style={{ color: "#6b7280", maxWidth: "30rem", margin: "0 auto 2.5rem" }}>
          We provide custom UAV solutions for unique mission requirements. Talk to our engineering team today.
        </p>
        <a href="/#contact" className="btn-neon-solid" style={{ display: "inline-flex", padding: "1rem 2.5rem", borderRadius: "9999px", textDecoration: "none", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.2em" }}>
          CUSTOM MISSION REQUEST
        </a>
      </section>
    </main>
  );
}

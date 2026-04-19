"use client";
import { useState, useEffect } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
}

export default function BookingForm() {
  const { user, isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    service_id: "",
    mission_date: "",
    location: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data ?? []);
        setServicesError("");
      } catch (error) {
        console.error("Failed to fetch services", error);
        setServices([]);
        setServicesError("Service catalog is unavailable right now. Please refresh and try again.");
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage("Please sign in to request a mission.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/bookings", {
        service_id: formData.service_id,
        mission_date: formData.mission_date,
        location: formData.location,
        message: formData.message,
      });
      setStatus("success");
    } catch (error: any) {
      console.error("Booking failed", error.response?.data || error.message);
      setStatus("error");
      const detail = error.response?.data?.detail || error.response?.data?.error || "Mission request failed. Please try again.";
      setErrorMessage(detail);
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Ambient glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-10rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: "24rem",
          height: "24rem",
          background: "rgba(0,243,255,0.08)",
          borderRadius: "9999px",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10rem",
          top: "30%",
          width: "28rem",
          height: "28rem",
          background: "rgba(0,136,255,0.07)",
          borderRadius: "9999px",
          filter: "blur(120px)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center", marginBottom: "1rem" }}>
          <span style={{ height: "1px", width: "3rem", background: "rgba(0,243,255,0.4)" }} />
          <p className="section-label">Mission Control</p>
          <span style={{ height: "1px", width: "3rem", background: "rgba(0,243,255,0.4)" }} />
        </div>

        <h2
          className="gradient-text"
          style={{
            fontFamily: "var(--font-orbitron), monospace",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            textAlign: "center",
            textTransform: "uppercase",
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Schedule Your Flight
        </h2>
        <p
          style={{
            color: "#6b7280",
            textAlign: "center",
            fontSize: "0.875rem",
            marginBottom: "3rem",
            letterSpacing: "0.05em",
          }}
        >
          {isLoggedIn 
            ? `Logged in as ${user?.name}. Ready for deployment.`
            : "Tell us your requirements and we will launch a tailored mission."}
        </p>

        <div
          style={{
            background: "rgba(0, 15, 30, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(0, 243, 255, 0.2)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            boxShadow: "0 0 60px rgba(0,243,255,0.06), 0 4px 40px rgba(0,0,0,0.5)",
          }}
        >
          {status === "success" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1rem", gap: "1.5rem", textAlign: "center" }}>
              <CheckCircle2 size={64} color="#00f3ff" style={{ filter: "drop-shadow(0 0 16px rgba(0,243,255,0.8))" }} />
              <h3 style={{ fontFamily: "var(--font-orbitron), monospace", fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Mission <span style={{ color: "#00f3ff", textShadow: "0 0 12px rgba(0,243,255,0.8)" }}>Requested</span>
              </h3>
              <p style={{ color: "#9ca3af", maxWidth: "18rem" }}>We&apos;ve received your mission parameters. Command will review and approve within 24 hours.</p>
              <button onClick={() => setStatus("idle")} className="btn-neon" style={{ padding: "0.625rem 1.5rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                <span>New Request</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
              {status === "error" && (
                <div style={{ gridColumn: "1 / -1", padding: "1rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#f87171", fontSize: "0.85rem" }}>
                  <AlertCircle size={18} /> {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Full Name</label>
                <input type="text" readOnly value={user?.name || "Guest"} className="input-neon" style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%", opacity: 0.6 }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Service Type</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="service_id"
                    required
                    value={formData.service_id}
                    onChange={handleChange}
                    disabled={loadingServices || !!servicesError || services.length === 0}
                    className="input-neon"
                    style={{ padding: "0.875rem 2.5rem 0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%", appearance: "none", cursor: "pointer" }}
                  >
                    {loadingServices ? (
                      <option value="" disabled style={{ background: "#030810", color: "#9ca3af" }}>Loading services...</option>
                    ) : servicesError ? (
                      <option value="" disabled style={{ background: "#030810", color: "#fca5a5" }}>Service catalog unavailable</option>
                    ) : services.length === 0 ? (
                      <option value="" disabled style={{ background: "#030810", color: "#9ca3af" }}>No services available</option>
                    ) : (
                      <>
                        <option value="" disabled style={{ background: "#030810", color: "rgba(232, 244, 248, 0.3)" }}>Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id} style={{ background: "#030810", color: "#e8f4f8" }}>{s.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00f3ff" strokeWidth="2" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><polyline points="6 9 12 15 18 9" /></svg>
                </div>
                {servicesError && (
                  <p style={{ color: "#fca5a5", fontSize: "0.75rem", lineHeight: 1.5 }}>{servicesError}</p>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Mission Date</label>
                <input type="date" name="mission_date" required value={formData.mission_date} onChange={handleChange} className="input-neon" style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%", colorScheme: "dark" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="input-neon" style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%" }} placeholder="City, State" />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
                <label className="booking-label">Mission Brief</label>
                <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="input-neon" style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%", resize: "none" }} placeholder="Describe your project requirements…" />
              </div>

              <button type="submit" disabled={status === "loading"} className="btn-neon-solid" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "1.125rem", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "0.5rem", opacity: status === "loading" ? 0.7 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}>
                {status === "loading" ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Processing…</> : <><Send size={16} /> Request Clearance</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

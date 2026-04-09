"use client";
import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const services = [
  "Cinematography",
  "Mapping & Survey",
  "Thermal Inspection",
  "Training Academy",
  "Custom Mission",
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    service: services[0],
    date: "",
    location: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1800);
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
        {/* Label */}
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
          Tell us your requirements and we will launch a tailored mission.
        </p>

        {/* Card */}
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
            /* ── Success ── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 1rem",
                gap: "1.5rem",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative" }}>
                <CheckCircle2
                  size={64}
                  color="#00f3ff"
                  style={{ filter: "drop-shadow(0 0 16px rgba(0,243,255,0.8))" }}
                />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-orbitron), monospace",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Mission{" "}
                <span
                  style={{
                    color: "#00f3ff",
                    textShadow: "0 0 12px rgba(0,243,255,0.8)",
                  }}
                >
                  Requested
                </span>
              </h3>
              <p style={{ color: "#9ca3af", maxWidth: "18rem" }}>
                We've received your details and will contact you within 24 hours to
                confirm your flight.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="btn-neon"
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: "0.5rem",
                }}
              >
                <span>New Request</span>
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}
            >
              {/* Full Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Full Name</label>
                <input
                  id="booking-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-neon"
                  style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%" }}
                  placeholder="John Doe"
                />
              </div>

              {/* Service Type */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Service Type</label>
                <div style={{ position: "relative" }}>
                  <select
                    id="booking-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="input-neon"
                    style={{
                      padding: "0.875rem 2.5rem 0.875rem 1rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      width: "100%",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    {services.map((s) => (
                      <option key={s} value={s} className="bg-dronedark">
                        {s}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#00f3ff"
                    strokeWidth="2"
                    style={{
                      position: "absolute",
                      right: "0.875rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {/* Mission Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Mission Date</label>
                <input
                  id="booking-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-neon"
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    width: "100%",
                    colorScheme: "dark",
                  }}
                />
              </div>

              {/* Location */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label className="booking-label">Location</label>
                <input
                  id="booking-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-neon"
                  style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", width: "100%" }}
                  placeholder="City, State"
                />
              </div>

              {/* Mission Brief */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
                <label className="booking-label">Mission Brief</label>
                <textarea
                  id="booking-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="input-neon"
                  style={{
                    padding: "0.875rem 1rem",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    width: "100%",
                    resize: "none",
                  }}
                  placeholder="Describe your project requirements…"
                />
              </div>

              {/* Submit */}
              <button
                id="booking-submit"
                type="submit"
                disabled={status === "loading"}
                className="btn-neon-solid"
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "1.125rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                  fontWeight: 900,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginTop: "0.5rem",
                  opacity: status === "loading" ? 0.7 : 1,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                    Processing…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Request Clearance
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

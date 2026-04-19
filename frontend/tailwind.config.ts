import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        droneblack:  "#030810",
        dronedark:   "#060f1c",
        dronenavy:   "#0a1628",
        droneblue:   "#00f3ff",
        droneblue2:  "#0088ff",
        dronemid:    "#003050",
      },
      boxShadow: {
        neon:        "0 0 20px rgba(0, 243, 255, 0.3)",
        "neon-md":   "0 0 35px rgba(0, 243, 255, 0.45)",
        "neon-strong":"0 0 60px rgba(0, 243, 255, 0.6), 0 0 120px rgba(0, 243, 255, 0.2)",
        "inset-neon":"inset 0 0 20px rgba(0, 243, 255, 0.08)",
        "card":      "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,243,255,0.08)",
      },
      dropShadow: {
        neon: ["0 0 8px rgba(0,243,255,0.8)", "0 0 24px rgba(0,243,255,0.5)"],
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00f3ff 0%, #0088ff 100%)",
        "dark-gradient": "linear-gradient(180deg, #030810 0%, #060f1c 100%)",
      },
      animation: {
        float:       "float 4s ease-in-out infinite",
        "pulse-neon":"pulse-neon 2s ease-in-out infinite",
        shimmer:     "shimmer 4s linear infinite",
        "fade-up":   "fade-up 0.6s ease forwards",
        scan:        "scan 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,243,255,0.3)" },
          "50%":       { boxShadow: "0 0 30px rgba(0,243,255,0.7), 0 0 60px rgba(0,243,255,0.3)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
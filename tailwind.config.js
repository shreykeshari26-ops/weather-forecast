/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        night: "#02080d",
        abyss: "#041214",
        tealdeep: "#071c20",
        neon: {
          green: "#67f7c4",
          blue: "#47b8ff",
          cyan: "#7df9ff"
        }
      },
      boxShadow: {
        frame: "0 24px 80px rgba(0,0,0,0.42)",
        glass: "0 24px 60px rgba(0,0,0,0.28), 0 0 34px rgba(71,184,255,0.10)",
        panel: "0 16px 40px rgba(0,0,0,0.24)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "frame-fade": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.99)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" }
        },
        "float-orb": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -14px, 0) scale(1.06)" }
        },
        "ambient-shift": {
          "0%": { transform: "translate3d(-1%, -1%, 0) scale(1)", opacity: "0.84" },
          "100%": { transform: "translate3d(1.5%, 1%, 0) scale(1.04)", opacity: "1" }
        },
        "ambient-drift": {
          "0%": { transform: "translate3d(-2%, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(1%, -1.5%, 0) scale(1.03)" },
          "66%": { transform: "translate3d(0.5%, 1%, 0) scale(1.05)" },
          "100%": { transform: "translate3d(-1%, -0.5%, 0) scale(1.02)" }
        }
      },
      animation: {
        "fade-up": "fade-up 720ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "frame-fade": "frame-fade 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
        "float-orb": "float-orb 14s ease-in-out infinite",
        "ambient-shift": "ambient-shift 18s ease-in-out infinite alternate",
        "ambient-drift": "ambient-drift 24s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

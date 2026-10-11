/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bankism: {
          dark: "#0A0A0B",
          darker: "#060709",
          navy: "#111629",
          card: "#12141C",
          cardHover: "#181B26",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#00D2FF",
          cyan: "#38BDF8",
          lime: "#A8F04A",
          emerald: "#20C96B",
          amber: "#FF861A",
          crimson: "#EF4444",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
}

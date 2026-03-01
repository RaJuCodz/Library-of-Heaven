/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary accent — deep literary wine/crimson
        wine: {
          50:  "#FDF2F2",
          100: "#FAE0E0",
          200: "#F5BEBE",
          300: "#E98A8A",
          400: "#D95555",
          500: "#B52A2A",
          600: "#801818",
          700: "#6B1414",
          800: "#561010",
          900: "#3D0C02",
          950: "#220600",
        },
        // Light mode backgrounds — warm parchment
        parchment: {
          50:  "#FDFCFB",
          100: "#F9F6F2",
          200: "#F4F0EC",
          300: "#EDE8E1",
          400: "#DDD3C5",
          500: "#C4B5A0",
          600: "#A89880",
          700: "#8C7A60",
          800: "#6B5C42",
          900: "#463D2B",
          950: "#2A2418",
        },
        // Dark mode backgrounds — prussian navy
        navy: {
          50:  "#E8EEF5",
          100: "#B6CDE0",
          200: "#6B9EC4",
          300: "#3A74A8",
          400: "#1E5487",
          500: "#0E3A66",
          600: "#002147",
          700: "#001A38",
          800: "#001228",
          900: "#000A18",
          950: "#00060F",
        },
        // Warm secondary — aged leather/toffee
        toffee: {
          50:  "#F5EDE4",
          100: "#EAD9C5",
          200: "#D5B590",
          300: "#C09365",
          400: "#AB7543",
          500: "#926644",
          600: "#79553A",
          700: "#61442E",
          800: "#4A3323",
          900: "#321F12",
        },
        // Keep primary for backwards compat
        primary: {
          50:  "#FDF2F2",
          100: "#FAE0E0",
          200: "#F5BEBE",
          300: "#E98A8A",
          400: "#D95555",
          500: "#B52A2A",
          600: "#801818",
          700: "#6B1414",
          800: "#561010",
          900: "#3D0C02",
          950: "#220600",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-wine":   "0 0 20px rgba(128, 24, 24, 0.25)",
        "glow-toffee": "0 0 20px rgba(146, 102, 68, 0.25)",
        card:          "0 4px 24px -4px rgba(0,0,0,0.10), 0 1px 4px -1px rgba(0,0,0,0.06)",
        "card-hover":  "0 16px 40px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.10)",
        "card-dark":   "0 4px 24px -4px rgba(0,0,0,0.40), 0 1px 4px -1px rgba(0,0,0,0.20)",
        glass:         "0 8px 32px 0 rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease-in-out",
        "fade-in-up":  "fadeInUp 0.7s ease-out both",
        "slide-up":    "slideUp 0.5s ease-out",
        "float":       "float 4s ease-in-out infinite",
        "pulse-slow":  "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer":     "shimmer 1.8s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-wine":     "linear-gradient(135deg, #801818 0%, #3D0C02 100%)",
        "gradient-navy":     "linear-gradient(135deg, #002147 0%, #000A18 100%)",
        "gradient-parchment":"linear-gradient(135deg, #F4F0EC 0%, #EDE8E1 100%)",
        "gradient-hero-light":"linear-gradient(135deg, rgba(244,240,236,0.95) 0%, rgba(237,232,225,0.80) 60%, rgba(237,232,225,0.40) 100%)",
        "gradient-hero-dark": "linear-gradient(135deg, rgba(0,21,47,0.96) 0%, rgba(0,21,47,0.80) 60%, rgba(0,21,47,0.40) 100%)",
      },
    },
  },
  plugins: [],
};

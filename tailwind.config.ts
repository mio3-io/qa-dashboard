import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,mjs}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06070d",
          900: "#0a0c14",
          800: "#10131d",
          700: "#171b27",
          600: "#1f2433",
          500: "#2a3043",
          400: "#3a4159",
        },
        brand: {
          violet: "#8b5cf6",
          fuchsia: "#d946ef",
          rose: "#fb7185",
          amber: "#fbbf24",
          lime: "#a3e635",
          emerald: "#34d399",
          cyan: "#22d3ee",
          sky: "#38bdf8",
        },
        tremor: {
          brand: {
            faint: "#1e1b4b",
            muted: "#312e81",
            subtle: "#6366f1",
            DEFAULT: "#8b5cf6",
            emphasis: "#a78bfa",
            inverted: "#ffffff",
          },
          background: {
            muted: "#0a0c14",
            subtle: "#10131d",
            DEFAULT: "#0a0c14",
            emphasis: "#e5e7eb",
          },
          border: { DEFAULT: "#1f2433" },
          ring: { DEFAULT: "#3a4159" },
          content: {
            subtle: "#64748b",
            DEFAULT: "#94a3b8",
            emphasis: "#e2e8f0",
            strong: "#f8fafc",
            inverted: "#0a0c14",
          },
        },
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(34,211,238,0.12), transparent 55%), radial-gradient(ellipse 60% 50% at 0% 30%, rgba(217,70,239,0.10), transparent 60%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,92,246,0.25), 0 10px 40px -10px rgba(139,92,246,0.45)",
        ring: "inset 0 0 0 1px rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: {
        "tremor-small": "0.5rem",
        "tremor-default": "0.75rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": "0.75rem",
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg|text|border|ring|fill|stroke)-(violet|fuchsia|rose|amber|lime|emerald|cyan|sky|indigo|pink|red)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
  ],
  plugins: [],
};

export default config;

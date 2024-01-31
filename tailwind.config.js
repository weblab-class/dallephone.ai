/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./client/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      8: "8px",
      12: "12px",
      24: "24px",
    },
    extend: {},
    fontFamily: {
      sans: ["Itim", "sans-serif"],
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
      roman: "upper-roman",
    },
    animation: {
      "spin-slow": "spin 8s linear infinite",
    },
  },
  plugins: [],
};

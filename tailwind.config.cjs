module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        dark: {
          primary: "#43919b",
          secondary: "#30aadd",
          accent: "#00ffc6",
          neutral: "#555555",
          "base-content": "#ffffff",
          "base-100": "#111111",
          "--rounded-box": "3px",
          "--rounded-btn": "3px",
          "--rounded-badge": "3px",
          "--tab-radius": "3px"
        },
        light : {
          primary: "#43919b",
          secondary: "#30aadd",
          accent: "#00ffc6",
          neutral: "#e5e5e5",
          "base-content": "#000000",
          "base-100": "#ffffff",
          "--rounded-box": "3px",
          "--rounded-btn": "3px",
          "--rounded-badge": "3px",
          "--tab-radius": "3px"
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "dark",
  },
};
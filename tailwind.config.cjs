module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        // dark: {
        //   primary: "#43919b",
        //   secondary: "#30aadd",
        //   accent: "#00ffc6",
        //   neutral: "#555555",
        //   "base-content": "#ffffff",
        //   "base-100": "#414141",
        //   "--rounded-box": "3px",
        //   "--rounded-btn": "3px",
        //   "--rounded-badge": "3px",
        //   "--tab-radius": "3px"
        // },
        // light : {
        //   primary: "#43919b",
        //   secondary: "#30aadd",
        //   accent: "#00ffc6",
        //   neutral: "#e5e5e5",
        //   "base-content": "#000000",
        //   "base-100": "#ffffff",
        //   "--rounded-box": "3px",
        //   "--rounded-btn": "3px",
        //   "--rounded-badge": "3px",
        //   "--tab-radius": "3px"
        // },
        mytheme: {
          primary: "#e24a6e",
          secondary: "#83f42c",
          accent: "#c1e053",
          neutral: "#1D2125",
          "base-300": "#EAEFF5",
          "base-200": "#FAFAFA",
          "base-100": "#FFFFFF",
          info: "#A7B5E2",
          success: "#3FE97D",
          warning: "#EDB807",
          error: "#EB735C",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "dark",
  },
  theme: {
    extend: {
      animation: {
        'gradient-x':'gradient-x 5s ease infinite',
        'gradient-y':'gradient-y 5s ease infinite',
        'gradient-xy':'gradient-xy 5s ease infinite',
      },
      keyframes: {
        'gradient-y': {
            '0%, 100%': {
                'background-size':'400% 400%',
                'background-position': 'center top'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'center center'
            }
        },
        'gradient-x': {
            '0%, 100%': {
                'background-size':'200% 200%',
                'background-position': 'left center'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'right center'
            }
        },
        'gradient-xy': {
            '0%, 100%': {
                'background-size':'400% 400%',
                'background-position': 'left center'
            },
            '50%': {
                'background-size':'200% 200%',
                'background-position': 'right center'
            }
        }
      },
      height: {
        'full-no-header': 'calc(100vh - 89px)',
      },
    },
  },
};

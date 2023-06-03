module.exports = {
  important: true,
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-themer")({
      defaultTheme: {
        // put the default values of any config you want themed
        // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
        extend: {
          // colors is used here for demonstration purposes
          colors: {
            background: "white",
            success: {
              900: "#14532D",
              700: "#15803D",
              500: "#22C55E",
              300: "#86EFAC",
              200: "#BBF7D0",
            },
            secondary: {
              900: "#A1A1AA",
              700: "#D4D4D8",
              500: "#E4E4E7",
              300: "#F4F4F5",
              200: "#FAFAFA",
            },
            failure: {
              900: "#7F1D1D",
              700: "#B91C1C",
              500: "#EF4444",
              300: "#FCA5A5",
              200: "#FECACA",
            },
            warning: {
              900: "#713F12",
              700: "#A16207",
              500: "#EAB308",
              200: "#FEF08A",
            },
            primary: {
              900: "#1E3A8A",
              700: "#1D4ED8",
              500: "#6366F1",
              300: "#93C5FD",
              200: "#BFDBFE",
            },
            foreground: "black",
            fastm: {
              text: "white",
              holder: "black",
              background: "blue",
            },
          },
        },
      },
      themes: [
        {
          // name your theme anything that could be a valid css class name
          // remember what you named your theme because you will use it as a class to enable the theme
          name: "darkTheme",
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              background: "#18181B",
              success: {
                900: "#365314",
                700: "#3F6212",
                500: "#4D7C0F",
                300: "#65A30D",
                200: "#84CC16",
              },
              secondary: {
                200: "#0F172A",
                300: "#1E293B",
                500: "#334155",
                700: "#475569",
                900: "#64748B",
              },
              failure: {
                900: "#7C2D12",
                700: "#9A3412",
                500: "#C2410C",
                300: "#EA580C",
                200: "#F97316",
              },
              warning: {
                900: "#713F12",
                700: "#A16207",
                500: "#EAB308",
                200: "#FEF08A",
              },
              primary: {
                900: "#1E3A8A",
                700: "#1E40AF",
                500: "#1D4ED8",
                300: "#2563EB",
                200: "#3B82F6",
              },
              foreground: "white",
              fastm: {
                text: "white",
                holder: "#0F172A",
                background: "black",
              },
            },
          },
        },
      ],
    }),
  ],
};

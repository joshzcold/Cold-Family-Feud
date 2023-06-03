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
              900: "#18181B",
              700: "#44403C",
              500: "#71717A",
              300: "#D4D4D8",
              200: "#E4E4E7",
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
              200: "#FEF08A"
            },
            primary: {
              900: "#1E3A8A",
              700: "#1D4ED8",
              500: "#6366F1",
              300: "#93C5FD",
              200: "#BFDBFE",
            },
            foreground: "black",
          },
        },
      },
      themes: [
        {
          // name your theme anything that could be a valid css class name
          // remember what you named your theme because you will use it as a class to enable the theme
          name: "my-theme",
          // put any overrides your theme has here
          // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
          extend: {
            colors: {
              primary: "blue",
            },
          },
        },
      ],
    }),
  ],
};

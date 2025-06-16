module.exports = {
  content: ["./App.js", "./screens/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      colors: {
        yellow: {
          500: "#FFD500", // Perfect gold color
          600: "#FFC000", // Slightly darker gold
        },
      },
      spacing: {
        4.5: "18px",
      },
    },
  },
  plugins: [],
};

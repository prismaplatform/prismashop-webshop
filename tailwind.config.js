const defaultTheme = require("tailwindcss/defaultTheme");

function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      // If opacityValue is provided, return hex with the specified opacity (in rgba-like format, but using hex)
      return `${hexWithOpacity(cssVar, opacityValue)}`;
    }
    if (opacityVariable !== undefined) {
      // If opacityVariable is provided, return hex with opacity taken from the variable (if available)
      return `${hexWithOpacity(cssVar, `var(${opacityVariable}, 1)`)}`;
    }
    // Just return the hex color
    return `var(${cssVar})`;
  };
}

// Helper function to apply opacity to hex color code
function hexWithOpacity(cssVar, opacity) {
  // Assuming cssVar holds a valid hex value like #RRGGBB
  const hexColor = `var(${cssVar})`; // Example: #ff5733 (a hex color)

  // If opacity is a variable, we assume it's being handled by CSS for now, or passed in correctly
  if (opacity !== undefined && !isNaN(opacity)) {
    return `${hexColor}${convertOpacityToHex(opacity)}`;
  }
  return hexColor;
}

// Helper function to convert opacity value to hex
function convertOpacityToHex(opacity) {
  // Convert opacity value (0 to 1) into a 2-digit hexadecimal string (00 to FF)
  const hexOpacity = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return hexOpacity;
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "40px",
        "2xl": "128px",
      },
    },

    extend: {
      colors: {
        primary: {
          50: customColors("--c-primary-50"),
          100: customColors("--c-primary-100"),
          200: customColors("--c-primary-200"),
          300: customColors("--c-primary-300"),
          400: customColors("--c-primary-400"),
          500: customColors("--c-primary-500"),
          6000: customColors("--c-primary-600"),
          700: customColors("--c-primary-700"),
          800: customColors("--c-primary-800"),
          900: customColors("--c-primary-900"),
        },
        secondary: {
          50: customColors("--c-secondary-50"),
          100: customColors("--c-secondary-100"),
          200: customColors("--c-secondary-200"),
          300: customColors("--c-secondary-300"),
          400: customColors("--c-secondary-400"),
          500: customColors("--c-secondary-500"),
          6000: customColors("--c-secondary-600"),
          700: customColors("--c-secondary-700"),
          800: customColors("--c-secondary-800"),
          900: customColors("--c-secondary-900"),
        },
        neutral: {
          50: customColors("--c-neutral-50"),
          100: customColors("--c-neutral-100"),
          200: customColors("--c-neutral-200"),
          300: customColors("--c-neutral-300"),
          400: customColors("--c-neutral-400"),
          500: customColors("--c-neutral-500"),
          6000: customColors("--c-neutral-600"),
          700: customColors("--c-neutral-700"),
          800: customColors("--c-neutral-800"),
          900: customColors("--c-neutral-900"),
        },

        accent: {
          50: customColors("--c-accent-50"),
          100: customColors("--c-accent-100"),
          200: customColors("--c-accent-200"),
          300: customColors("--c-accent-300"),
          400: customColors("--c-accent-400"),
          500: customColors("--c-accent-500"),
          6000: customColors("--c-accent-600"),
          700: customColors("--c-accent-700"),
          800: customColors("--c-accent-800"),
          900: customColors("--c-accent-900"),
        },

        menu: {
          bg: {
            dark: customColors("--c-menu-bg-dark"),
            light: customColors("--c-menu-bg-light"),
          },
          text: {
            dark: customColors("--c-menu-text-dark"),
            light: customColors("--c-menu-text-light"),
          },
          border: {
            dark: customColors("--c-menu-border-dark"),
            light: customColors("--c-menu-border-light"),
          },
        },

        hero: {
          text: customColors("--c-hero-text"),
          bg: customColors("--c-hero-bg"),
          button: customColors("--c-hero-button"),
          buttonText: customColors("--c-hero-button-text"),
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

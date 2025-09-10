import baseConfig from "../../eslint.config.mjs";

// Frontend-specific ESLint configuration
const eslintConfig = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Frontend-specific rules can be added here
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;

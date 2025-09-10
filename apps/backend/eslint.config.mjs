import baseConfig from "../../eslint.config.mjs";

// Backend-specific ESLint configuration
const eslintConfig = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Backend-specific rules - more relaxed for API development
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-anonymous-default-export": "off",
      "prefer-const": "off",
      "@next/next/no-img-element": "off",
      "no-console": "off", // Allow console logs in backend
    },
  },
];

export default eslintConfig;

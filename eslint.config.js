import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/**
 * Root lint config for examples .mjs files (ESM, Node).
 * Run: npm run lint from the repository root (after npm install).
 */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/package-lock.json",
      ".cursor/**",
      "skills/**",
      "docs/**",
      "**/.git/**",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["examples/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "no-console": "off",
      eqeqeq: ["error", "smart"],
    },
  },
];

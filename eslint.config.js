import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Lint config for examples TypeScript (ESM, Node).
 * Run: npm run lint from the repository root (after npm install).
 */
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/package-lock.json",
      ".cursor/**",
      "skills/**",
      "**/.git/**",
    ],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    files: ["examples/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      eqeqeq: ["error", "smart"],
    },
  },
);

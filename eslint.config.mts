import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "build/**"]
  },
  {
    files: ["eslint.config.mts"],
    languageOptions: {
      parserOptions: {
        project: null,
      }
    }
  },
  {
    files: ["src/**/*.{ts,tsx}"], //**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2022,
      }
    },
    rules: { // Thêm rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    },
  },
  tseslint.configs.recommended,
]);
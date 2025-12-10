import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable require import restriction for config files
      "@typescript-eslint/no-require-imports": "off",
      // Allow unused vars that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      // Allow empty interfaces
      "@typescript-eslint/no-empty-interface": "off",
      // Allow any type in some cases
      "@typescript-eslint/no-explicit-any": "warn",
    }
  }
];

export default eslintConfig;
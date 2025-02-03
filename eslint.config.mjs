import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const baseConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

const customConfig = {
  plugins: {
    "unused-imports": unusedImports,
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "unused-imports/no-unused-imports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^react", "^next", "^@", "^\\w"],
          ["^react-icons/lib", "^react-icons"],
          ["^(type|types|~/type|~/types)"],
          ["^~/"],
        ],
      },
    ],
  },
};

export default [...baseConfig, customConfig];

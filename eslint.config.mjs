// @ts-check

import { fileURLToPath } from "node:url";
import path from "path";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
// @ts-expect-error - eslint-plugin-react-hooks has no typedefs
import reactHooks from "eslint-plugin-react-hooks";
// @ts-expect-error - eslint-plugin-react has no typedefs
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Eslintrc to FlatConfig compatibility layer
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...eslintPluginAstro.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...reactRecommended,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    languageOptions: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  ...compat.config(reactHooks.configs.recommended),
  ...compat.plugins("jsx-a11y"),
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "prefer-const": "error",
      "no-case-declarations": "off",
    },
  },
  {
    ignores: ["dist/**/*", "src/env.d.ts"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },
);

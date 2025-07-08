import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";
import pluginNext from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin";

export default [
  // Base configuration
  js.configs.recommended,
  
  // TypeScript configuration
  ...tseslint.configs.recommended,
  
  // Global settings
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: { 
        ...globals.browser, 
        ...globals.node 
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  
  // React and Next.js configuration
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "jsx-a11y": pluginJsxA11y,
      import: pluginImport,
      "@next/next": pluginNext,
    },
    rules: {
      // React rules
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript
      "react/no-unescaped-entities": "warn", // Downgrade to warning
      "react/no-unknown-property": ["error", { ignore: ["tw"] }], // Allow 'tw' for Tailwind
      
      // React Hooks rules
      ...pluginReactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn", // Downgrade to warning
      
      // JSX A11y rules (essential ones, but more lenient)
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": ["warn", {
        "components": ["Link"],
        "specialLink": ["hrefLeft", "hrefRight"],
        "aspects": ["invalidHref", "preferButton"]
      }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      
      // Import rules (enhanced)
      "import/no-anonymous-default-export": "warn",
      "import/no-unresolved": ["error", { 
        "ignore": ["^@/", "^~/"] // Ignore custom path aliases
      }],
      "import/no-absolute-path": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "warn",
      "import/no-duplicates": "error",
      
      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "warn", // Downgrade to warning
      "@next/next/no-img-element": "warn",
      "@next/next/no-unwanted-polyfillio": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      
      // TypeScript rules (more lenient)
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unused-expressions": ["error", { 
        "allowShortCircuit": true, 
        "allowTernary": true 
      }],
      
      // General JavaScript rules
      "no-empty": "warn",
      "no-unreachable": "error",
      "no-undef": "error",
      "no-constant-binary-expression": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },

  // API routes and server-side code
  {
    files: ["**/api/**/*.{js,ts}", "**/route.{js,ts}", "**/*.server.{js,ts}"],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^(req|res|next|_)",
        "varsIgnorePattern": "^_" 
      }],
    },
  },
  
  // Stylistic rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "single"],
    },
  },
  
  // Ignore patterns - should be first
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      ".git/**",
      "*.config.js",
      "*.config.mjs",
      "generated/**", // Prisma generated files
      "scripts/**",   // Build scripts
      "public/**",    // Static assets
      ".env*",
      "coverage/**",
    ],
  },

  // Special config for scripts (allow CommonJS)
  {
    files: ["scripts/**/*.js", "*.config.js"],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: "script", // CommonJS
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
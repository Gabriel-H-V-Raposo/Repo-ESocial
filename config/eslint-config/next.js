/** @typedef {import("eslint").Linter.Config} */

module.exports = {
  // extends: ["@rocketseat/eslint-config/next"],
  extends: [
    "eslint:recommended", // Regras recomendadas do ESLint
    "plugin:react/recommended", // Regras recomendadas do React
    "plugin:react-hooks/recommended", // Regras recomendadas para React Hooks
    "next", // Regras específicas do Next.js
    "next/core-web-vitals", // Regras de performance recomendadas pelo Next.js
    "plugin:prettier/recommended", // Integração com Prettier
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Suporte para JSX
    },
    ecmaVersion: 12, // ECMAScript 12
    sourceType: "module", // Suporte para módulos ES
  },
  plugins: ["react", "prettier", "simple-import-sort"], // Plugins para React e Prettier
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        quoteProps: "as-needed",
        jsxSingleQuote: false,
        trailingComma: "es5",
        bracketSpacing: true,
        arrowParens: "always",
        endOfLine: "auto",
        bracketSameLine: false,
      },
    ],
    "react/react-in-jsx-scope": "off", // Desativa a necessidade de importar React em arquivos JSX (Next.js já lida com isso)
    "react/prop-types": "off", // Desativa a verificação de prop-types se você não as usa
  },
  settings: {
    react: {
      version: "detect", // Detecta automaticamente a versão do React usada no projeto
    },
  },
  // rules: {
  //   "simple-import-sort/imports": "error",
  //   "simple-import-sort/exports": "error",
  // },
};

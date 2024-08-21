/** @typedef {import("eslint").Linter.Config} */

module.exports = {
  // extends: ["@rocketseat/eslint-config/react"],
  extends: [
    "eslint:recommended", // Regras recomendadas do ESLint
    "plugin:prettier/recommended", // Integração com Prettier
  ],
  parserOptions: {
    ecmaVersion: 12, // ECMAScript 12
    sourceType: "module", // Suporte para módulos ES
  },
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
        trailingComma: "es5",
        bracketSpacing: true,
        arrowParens: "always",
        endOfLine: "auto",
        bracketSameLine: false,
      },
    ],
    // Outras regras do ESLint podem ser adicionadas aqui, conforme necessário
  },
  plugins: ["simple-import-sort"],
  // rules: {
  //   "simple-import-sort/imports": "error",
  //   "simple-import-sort/exports": "error",
  // },
};

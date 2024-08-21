/** @typedef {import("eslint").Linter.Config} */

module.exports = {
  // extends: ["@rocketseat/eslint-config/node"],
  extends: [
    "eslint:recommended", // Extende as regras recomendadas do ESLint
    "plugin:prettier/recommended", // Integra o Prettier com o ESLint
  ],
  parserOptions: {
    ecmaVersion: 12, // Define a versão do ECMAScript
    sourceType: "module", // Permite o uso de módulos ES
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
        jsxSingleQuote: false,
        trailingComma: "es5",
        bracketSpacing: true,
        arrowParens: "always",
        endOfLine: "auto",
        bracketSameLine: false,
      },
    ],
    // Outras regras do ESLint podem ser configuradas aqui
    "no-console": "off", // Exemplo: desabilita avisos para o uso de console.log
  },
  plugins: ["simple-import-sort"],
  // rules: {
  //   "simple-import-sort/imports": "error",
  //   "simple-import-sort/exports": "error",
  // },
};

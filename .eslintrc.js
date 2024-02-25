module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "sort-imports": [
      "error",
      {
        ignoreCase: true, // 大文字小文字を区別しない
        ignoreDeclarationSort: true, // import文のソートを無視
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          ["external", "builtin"], // 組み込みモジュール, npmでインストールした外部ライブラリ
          "internal", // 自作モジュール
          ["parent", "sibling"],
          "object",
          "type",
          "index",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "next/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@/components/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal", "react"],
        "newlines-between": "always", // グループ毎にで改行を入れる
        alphabetize: {
          order: "asc", // 昇順にソート
          caseInsensitive: true, // 小文字大文字を区別する
        },
      },
    ],
  },
};

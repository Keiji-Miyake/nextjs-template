module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
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
    "import/order": [
      "error",
      {
        groups: [
          "builtin", // 組み込みモジュール
          "external", // npmでインストールした外部ライブラリ
          "internal", // 自作モジュール
          ["parent", "sibling"],
          "object",
          "type",
          "index",
        ],
        "newlines-between": "always", // グループ毎にで改行を入れる
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order: "asc", // 昇順にソート
          caseInsensitive: true, // 小文字大文字を区別する
        },
        pathGroups: [
          // 指定した順番にソートされる
          {
            pattern: "@/components/common",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/components/hooks",
            group: "internal",
            position: "before",
          },
        ],
      },
    ],
  },
};
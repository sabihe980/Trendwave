import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  {
    ignores: ["build/**", ".next/**", "node_modules/**", "dist/**"],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;

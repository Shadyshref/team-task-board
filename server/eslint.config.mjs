import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const typedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ["**/*.ts"],
  languageOptions: {
    ...config.languageOptions,
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
}));

export default tseslint.config(
  {
    ignores: [
      ".agents/**",
      ".claude/**",
      ".windsurf/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "src/generated/**",
    ],
  },
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...typedConfigs,
  prettier,
);

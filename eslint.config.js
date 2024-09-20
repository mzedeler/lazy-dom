import eslint from '@eslint/js';
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import mochaPlugin from 'eslint-plugin-mocha'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  {
    rules: {
      'mocha/no-mocha-arrows': 'off' 
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
)

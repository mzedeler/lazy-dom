import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import mochaPlugin from 'eslint-plugin-mocha'

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
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
];
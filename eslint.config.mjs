import eslint from '@eslint/js';
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import mochaPlugin from 'eslint-plugin-mocha'

export default tseslint.config(
  { ignores: ['dist/', 'test/ported', 'src/assembly', 'vendor/'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  mochaPlugin.configs.flat.recommended,
  {
    rules: {
      'mocha/no-mocha-arrows': 'off',
      'no-unused-vars': 'off' // already handled correctly by @typescript/no-unused-vars
    }
  },
  {
    files: ['**/*.test.ts', 'test/wpt/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },
  {
    files: ['test/wpt/**/*.ts'],
    rules: {
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-exports': 'off',
      'mocha/no-skipped-tests': 'off',
      'mocha/handle-done-callback': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-undef': 'off'
    }
  }
)

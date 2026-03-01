import eslint from '@eslint/js';
import globals from "globals";
import tseslint from "typescript-eslint";
import mochaPlugin from 'eslint-plugin-mocha'

export default tseslint.config(
  { ignores: ['dist/', 'test/ported/', 'assembly/', 'jsdom/', 'vendor/', 'build/'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  mochaPlugin.configs.flat.recommended,
  {
    rules: {
      'mocha/no-mocha-arrows': 'off',
      'no-unused-vars': 'off', // already handled correctly by @typescript-eslint/no-unused-vars
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }]
    }
  },
  {
    files: ['**/*.ts'],
    rules: { 'no-undef': 'off' }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'mocha/no-skipped-tests': 'error',
    }
  },
  {
    files: ['test/wpt/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'mocha/no-setup-in-describe': 'off',
      'mocha/no-exports': 'off',
      'mocha/no-skipped-tests': 'off',
      'mocha/handle-done-callback': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'prefer-spread': 'off',
    }
  }
)

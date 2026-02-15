import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import nodePlugin from 'eslint-plugin-n';

export default defineConfig([
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  },
  globalIgnores(['dist/', 'node_modules/']),
  {
    plugins: { n: nodePlugin },
    rules: {
      'n/exports-style': ['error', 'module.exports']
    }
  },
  {
    rules: {
      eqeqeq: ['error', 'smart'],
      complexity: ['error', 8],
      'no-console': 'error',
      semi: [2, 'always']
    }
  },
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended
]);

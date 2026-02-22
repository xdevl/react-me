// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        "version": "detect"
      }
    }
  },
  // reactPlugin.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  {
    // TODO: to be addressed
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn"
    }
  }
);
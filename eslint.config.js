import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'no-useless-assignment': 'warn',
      ...prettier.rules,
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  // Three.js files: mixer.timeScale is standard R3F pattern
  {
    files: ['src/components/three/**/*.jsx', 'src/components/heart/**/*.jsx'],
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
  // Context files export Provider + Hook (standard React pattern)
  {
    files: ['src/context/**/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  // Data fetching in useEffect is a legitimate pattern
  {
    files: ['src/pages/**/*.jsx', 'src/api/**/*.js'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

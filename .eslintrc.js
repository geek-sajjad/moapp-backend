module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'prettier', 'unused-imports'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.eslint.json'],
      },
    },
  },
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'import/order': 'off',

    // Disable base rules
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',

    // Enable TypeScript-specific rules
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['constructors'],
      },
    ],

    // Other general rules
    'no-console': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',

    // TypeScript-specific rules
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['warn'],

    // Import plugin rules
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // Prettier
    'prettier/prettier': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },

  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        // Allow importing devDependencies in test files
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: false,
          },
        ],
      },
    },
    {
      files: ['**/*.entity.ts', '**/entities/index.ts'], // or `**/*.entity.js` if you're using JS
      rules: {
        'import/no-cycle': 'off',
      },
    },
  ],
};

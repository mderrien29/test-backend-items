module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['external', 'internal'],
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-unused-modules': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/domain',
            from: './src/driven',
            message: "Domain components can't import driven components.",
          },
          {
            target: './src/domain',
            from: './src/usecase',
            message: "Domain components can't import usecase components.",
          },
          {
            target: './src/domain',
            from: './src/driving',
            message: "Domain components can't import driving components.",
          },
          {
            target: './src/usecase',
            from: './src/driven',
            message: "Usecase components can't import driven components.",
          },
          {
            target: './src/usecase',
            from: './src/driving',
            message: "Usecase components can't import driving components.",
          },
          {
            target: './src/driven',
            from: './src/driving',
            message: "Driven components can't import driving components.",
          },
          {
            target: './src/infra',
            from: './src/driving',
            message: "Driven components can't import driving components.",
          },
        ],
      },
    ],
  },
};

module.exports = {
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
  ignorePatterns: ['**/build/*', '**/dist/*', '*.d.ts'],
  rules: {
    'import/no-unresolved': 'warn',
    'import/named': 'warn',
    'arrow-body-style': ['error', 'as-needed'],
    semi: ['error', 'never'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
    'class-methods-use-this': ['error'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    curly: ['error', 'all'],
    eqeqeq: ['error'],
    'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
    'object-shorthand': ['error', 'properties'],
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTrailingComments: true,
        ignorePattern: '^import',
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-console': ['error', { allow: ['error'] }],
    'no-debugger': 'error',
    'no-throw-literal': 'error',
    'no-restricted-syntax': ['error'],
    'no-underscore-dangle': ['error', { allow: ['__ENV', '__typename', '_id', '_key', '_type', '_ref'] }],
    'no-use-before-define': ['error'],
    'object-curly-newline': ['error', { consistent: true }],
    'prefer-destructuring': ['error'],
    'prefer-promise-reject-errors': ['error'],
    'jsx-quotes': ['error', 'prefer-double'],
  },
  overrides: [
    {
      files: ['ui/src/**/*'],
      plugins: ['react', 'react-hooks', 'import'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      parserOptions: {
        ecmaVersion: 11,
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
      rules: {
        'react/default-props-match-prop-types': ['error'],
        'react/display-name': ['error'],
        'react/forbid-prop-types': ['error'],
        'react/jsx-closing-tag-location': ['error'],
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore' }],
        'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
        'react/jsx-sort-props': ['error'],
        'react/no-array-index-key': ['error'],
        'react/no-typos': ['error'],
        'react/no-unused-prop-types': ['error'],
        'react/no-unused-state': ['error'],
        'react/prefer-stateless-function': ['error'],
        'react/require-default-props': ['off'],
        'react/react-in-jsx-scope': ['off'],
        'react/sort-comp': [
          1,
          {
            order: ['static-methods', 'lifecycle', 'everything-else', 'render'],
          },
        ],

        'import/order': [
          'error',
          {
            alphabetize: { order: 'asc', caseInsensitive: true, orderImportKind: 'asc' },
            groups: ['builtin', 'external', 'internal', 'index', ['parent', 'sibling'], 'object'],
            'newlines-between': 'always',
            pathGroupsExcludedImportTypes: ['builtin'],
          },
        ],
        'import/no-default-export': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
    {
      files: ['ui/**/*.ts', 'ui/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/method-signature-style': ['error', 'method'],
      },
    },
    {
      files: ['ui/**/*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      rules: {
        '@graphql-eslint/known-type-names': 'error',
      },
    },
  ],
}

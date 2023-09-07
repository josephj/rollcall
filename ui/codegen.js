const commonPlugins = [
  {
    add: {
      content: ['/* eslint-disable */'],
    },
  },
  {
    add: {
      content: ['/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */'],
    },
  },
]

const config = {
  generates: {
    'src/generated/types.ts': {
      schema: './schema.graphql',
      documents: '**/*.graphql',
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
      },
    },
    'src/generated/hooks.ts': {
      schema: './schema.graphql',
      documents: '**/*.graphql',
      plugins: ['typescript-react-apollo', ...commonPlugins],
      config: {
        withHooks: true,
        inlineFragmentTypes: 'combine',
        useTypeImports: true,
      },
      preset: 'import-types',
      presetConfig: {
        typesPath: './types',
      },
    },
  },
  config: {
    namingConvention: {
      enumValues: 'change-case-all#upperCase',
    },
    useImplementingTypes: true,
    nonOptionalTypename: true,
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

module.exports = config

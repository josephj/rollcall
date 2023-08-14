import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5wmwst53',
  },
  graphql: [
    {
      playground: false,
      workspace: 'production-workspace',
      id: 'schema-default',
    },
    {
      playground: true,
      workspace: 'development-workspace',
      id: 'schema-development',
    },
  ],
})

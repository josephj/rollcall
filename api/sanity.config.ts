import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {RobotIcon, RocketIcon} from '@sanity/icons'

export default defineConfig([
  {
    name: 'production-workspace',
    title: '點名系統（正式環境）',
    projectId: '5wmwst53',
    dataset: 'production',
    basePath: '/production',
    icon: RocketIcon,
    plugins: [deskTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
  {
    name: 'staging-workspace',
    title: '點名系統（測試環境）',
    projectId: '5wmwst53',
    dataset: 'development',
    basePath: '/staging',
    icon: RobotIcon,
    plugins: [deskTool(), visionTool()],
    schema: {
      types: schemaTypes,
    },
  },
])

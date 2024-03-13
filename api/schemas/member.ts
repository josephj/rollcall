import type {Rule as RuleType} from '@sanity/types'

export const member = {
  name: 'member',
  title: 'Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: RuleType) => Rule.required(),
      placeholder: 'English name (e.g. Jeffery Wang)',
    },
    {
      name: 'alias',
      title: 'Alias',
      type: 'string',
      placeholder: 'Chinese name (e.g. 王耀輝)',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'organizations',
      title: 'Organizations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'organization'}]}],
      validation: (Rule: RuleType) => Rule.required().min(1),
    },
    {
      name: 'gatherings',
      title: 'Gatherings',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'gathering'}]}],
    },
  ],
  preview: {
    select: {
      name: 'name',
      alias: 'alias',
    },
    prepare: ({name, alias}) => ({
      title: name,
      subtitle: alias,
    }),
  },
}

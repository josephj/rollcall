import type {Rule as RuleType} from '@sanity/types'

export const gathering = {
  name: 'gathering',
  title: 'Gathering',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{type: 'organization'}],
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'recurrence',
      title: 'Recurrence',
      type: 'string',
    },
    {
      name: 'occurrences',
      title: 'Occurrences',
      type: 'array',
      of: [
        {type: 'occurrence'}
      ],
    },
  ],
}

import {Rule as RuleType} from '@sanity/types'

import {slugify} from '../utils'

export const organization = {
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'title',
      title: 'title',
      type: 'string',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'name',
        maxLength: 200,
        slugify: (input: string) => slugify(input),
      },
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
  ],
  preview: {
    select: {
      name: 'name',
      slug: 'slug',
    },
    prepare: ({name, slug}) => {
      return {
        title: name,
        subtitle: `/${slug.current}`,
      }
    },
  },
}

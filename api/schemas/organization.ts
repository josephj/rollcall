import {Rule as RuleType} from '@sanity/types' // eslint-disable-line import/named

import {slugify} from '../utils'

// @ts-ignore
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
    // @ts-ignore
    prepare: ({name, slug}) => ({
      title: name,
      subtitle: `/${slug.current}`,
    }),
  },
}

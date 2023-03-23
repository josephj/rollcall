import type {Rule as RuleType} from '@sanity/types'

import {slugify} from '../utils'

export const gathering = {
  name: 'gathering',
  title: 'Gathering',
  type: 'document',
  initialValue: {
    location: '線上',
    organization: {
      _ref: '80160f51-ce0a-4d7a-9aa8-e54005dd82c5',
      _type: 'organization',
    },
    recurrence: 'RRULE:FREQ=WEEKLY;BYDAY=FR;BYHOUR=20;TZID=Australia/Sydney ',
  },
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      placeholder: 'English name (e.g. Faith Hope Love A)',
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      placeholder: 'Chinese name (e.g. 信望愛 B 小組)',
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      placeholder: 'Location (e.g. 線上)',
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
      of: [{type: 'occurrence'}],
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
  ],
  preview: {
    select: {
      name: 'name',
      slug: 'slug',
      title: 'title',
    },
    prepare: ({name, slug, title}) => {
      return {
        title: `${title} (${name})`,
        subtitle: `/${slug.current}`,
      }
    },
  },
}

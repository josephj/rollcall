import type {Rule as RuleType} from '@sanity/types'

export const occurrence = {
  name: 'occurrence',
  title: 'Occurrence',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Date and time',
      type: 'date',
      validation: (Rule: RuleType) => Rule.required(),
    },
    {
      name: 'host',
      title: 'Occurrence host',
      type: 'reference',
      to: [{type: 'member'}],
    },
    {
      name: 'attendances',
      title: 'Attendances',
      type: 'array',
      of: [{type: 'attendance'}],
      // fields: [
      //   {
      //     name: 'member',
      //     type: 'reference',
      //     to: [{type: 'member'}],
      //   },
      //   {
      //     name: 'note',
      //     type: 'string',
      //   },
      // ],
      // preview: {
      //   select: {
      //     memberName: 'member.name',
      //   },
      //   prepare({memberName}) {
      //     return {
      //       title: memberName,
      //     }
      //   },
      // },
      validation: (Rule: RuleType) =>
        Rule.custom((attendance = []) => {
          const members = attendance.map(({member}) => member?._ref).filter(Boolean)
          const duplicates = members.filter((value, index) => members.indexOf(value) !== index)
          if (duplicates.length > 0) {
            return `Attendance list contains duplicate members: ${duplicates.join(', ')}`
          }
          return true
        }),
    },
  ],
  preview: {
    select: {
      dateLabel: 'date',
    },
    prepare({dateLabel}) {
      return {
        title: dateLabel,
      }
    },
  },
}

export const attendance = {
  name: 'attendance',
  title: 'Attendance',
  type: 'object',
  fields: [
    {
      name: 'member',
      type: 'reference',
      to: [{type: 'member'}],
    },
    {
      name: 'note',
      type: 'string',
    },
  ],
  preview: {
    select: {
      memberName: 'member.name',
    },
    prepare({memberName}) {
      return {
        title: memberName,
      }
    },
  },
}

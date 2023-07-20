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
    {
      name: 'isHost',
      title: 'Hosting',
      type: 'boolean',
      description: 'Check this if the attendance is a host for a particular occurrence.',
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

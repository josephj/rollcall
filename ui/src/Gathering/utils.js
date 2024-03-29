import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { rrulestr } from 'rrule'

dayjs.extend(utc)

export const getUpcomingDates = ({ rrule }) => {
  const endDate = dayjs.utc().endOf('day')
  const startDate = endDate.subtract(1, 'week').startOf('day')
  rrule.options.dtstart = startDate.toDate()
  return rrule.between(startDate.toDate(), endDate.toDate(), true).map((date) => dayjs.utc(date).format('YYYY-MM-DD'))
}

export const getNextDate = (rruleString, currentDate) => {
  const rule = rrulestr(rruleString)
  const date = dayjs(currentDate || new Date())

  const occurrences = rule.between(date.add(1, 'day').toDate(), dayjs().add(1, 'year').toDate())
  const nextDate = occurrences.find((occurrence) => dayjs(occurrence).isAfter(date))

  return nextDate ? dayjs(nextDate).format('YYYY-MM-DD') : null
}

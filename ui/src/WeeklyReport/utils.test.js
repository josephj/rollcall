import MockDate from 'mockdate'

import { getReportStartEndDateTimes } from './utils'
describe('getReportStartEndDateTimes', () => {
  it('should return correct date times on Thursday', () => {
    MockDate.set('2023-04-27T12:30:00.000Z') // Thursday
    const { startDateTime, endDateTime } = getReportStartEndDateTimes()
    expect(startDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-04-21 00:00:00')
    expect(endDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-04-27 23:59:59')
  })

  it('should return correct date times on Friday', () => {
    MockDate.set('2023-04-28T12:30:00.000Z') // Friday
    const { startDateTime, endDateTime } = getReportStartEndDateTimes()
    expect(startDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-04-28 00:00:00')
    expect(endDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-05-04 23:59:59')
  })

  it('should return correct date time on Saturday', () => {
    MockDate.set('2023-04-29T00:00:00.000Z') // Saturday
    const { startDateTime, endDateTime } = getReportStartEndDateTimes()
    expect(startDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-04-28 00:00:00')
    expect(endDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-05-04 23:59:59')
  })

  it('should return correct date time on Monday', () => {
    MockDate.set('2023-05-01T00:00:00.000Z') // Monday
    const { startDateTime, endDateTime } = getReportStartEndDateTimes()
    expect(startDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-04-28 00:00:00')
    expect(endDateTime.format('YYYY-MM-DD HH:mm:ss')).toEqual('2023-05-04 23:59:59')
  })
})

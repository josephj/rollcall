import groq from 'groq'
import { useCallback } from 'react'

import { occurrenceQuery } from './query.occurrence'
import { sanityClient } from '../sanityClient'

export const useApi = ({ date, slug }) => {
  const addMember = useCallback(({ memberId, gatheringId }) => {
    sanityClient
      .patch(memberId)
      .append('gatherings', [{ _ref: gatheringId, _type: 'reference' }])
      .commit({ autoGenerateArrayKeys: true })
  }, [])

  const createMember = useCallback(
    async ({ name, alias, email, organizationId }) =>
      sanityClient.create({
        _type: 'member',
        alias,
        email,
        gatherings: [],
        name,
        organization: { _ref: organizationId, _type: 'reference' },
      }),
    []
  )

  const fetchOccurrence = useCallback(
    async () =>
      sanityClient.fetch(occurrenceQuery, {
        date,
        slug,
      }),
    [date, slug]
  )

  const updateAttendances = useCallback(async ({ gatheringId, occurrenceKey, attendanceMemberIds }) => {
    const attendances = attendanceMemberIds.map((memberId) => ({
      _type: 'attendance',
      member: {
        _ref: memberId,
        _type: 'reference',
      },
    }))

    return sanityClient
      .patch(gatheringId)
      .set({
        [`occurrences[_key == "${occurrenceKey}"].attendances`]: attendances,
      })
      .commit({ autoGenerateArrayKeys: true })
  }, [])

  const tickAttendance = async ({ gatheringId, occurrenceKey, memberId }) => {
    const { occurrences = [] } = await fetchOccurrence()
    const [{ attendances = [] }] = occurrences
    const isTicked = attendances.some(({ member }) => member._ref === memberId)
    if (isTicked) {
      return
    }

    const attendanceData = {
      _type: 'attendance',
      member: {
        _ref: memberId,
        _type: 'reference',
      },
    }

    return sanityClient
      .patch(gatheringId)
      .append(`occurrences[_key == "${occurrenceKey}"].attendances`, [attendanceData])
      .commit({ autoGenerateArrayKeys: true })
  }

  const untickAttendance = async ({ gatheringId, occurrenceKey, attendanceKey }) => {
    const { occurrences = [] } = await fetchOccurrence()
    const [{ attendances = [] }] = occurrences
    const isTicked = attendances.some(({ _key }) => _key === attendanceKey)
    if (!isTicked) {
      return
    }

    return sanityClient
      .patch(gatheringId)
      .unset([`occurrences[_key=="${occurrenceKey}"].attendances[_key=="${attendanceKey}"]`])
      .commit()
  }

  const updateOccurrence = async ({ gatheringId, prevDate, nextDate, hostMemberId }) => {
    const query = groq` *[_type == "gathering" && slug.current == $slug][0] { occurrences }`
    const { occurrences } = await sanityClient.fetch(query, {
      slug,
    })

    const currentOccurrence = occurrences.find(({ date }) => date === prevDate)
    const currentOccurrenceKey = currentOccurrence._key
    const dates = occurrences.map(({ date }) => date)
    const isValid = !dates.includes(nextDate)
    if (isValid) {
      await sanityClient
        .patch(gatheringId)
        .set({
          [`occurrences[_key == "${currentOccurrenceKey}"].date`]: nextDate,
        })
        .commit()
    }

    await sanityClient
      .patch(gatheringId)
      .set({
        [`occurrences[_key == "${currentOccurrenceKey}"].host`]: {
          _type: 'reference',
          _ref: hostMemberId,
        },
      })
      .commit()
  }

  return {
    addMember,
    createMember,
    fetchOccurrence,
    tickAttendance,
    untickAttendance,
    updateAttendances,
    updateOccurrence,
  }
}

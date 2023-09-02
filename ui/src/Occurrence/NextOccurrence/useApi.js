import { useCallback } from 'react'

import { sanityClient } from '../../sanityClient'

const QUERY = `
  *[_type == "gathering" && _id == $gatheringId][0] { 
    _id,
    "occurrence": occurrences[date == $date][0] {
      _key,
    }, 
  }
`

const getOccurrenceKey = async ({ gatheringId, date }) => {
  const { occurrence } = await sanityClient.fetch(QUERY, { gatheringId, date })
  return occurrence?._key
}
const createOccurrence = ({ gatheringId, date, hostMemberId }) => {
  const host = hostMemberId ? { _ref: hostMemberId, _type: 'reference' } : undefined
  const occurrence = { date, host, attendances: [], _type: 'occurrence' }

  return sanityClient
    .patch(gatheringId)
    .setIfMissing({ occurrences: [] })
    .append('occurrences', [occurrence])
    .commit({ autoGenerateArrayKeys: true })
}

const updateOccurrence = ({ gatheringId, occurrenceKey, hostMemberId }) => {
  const host = hostMemberId ? { _ref: hostMemberId, _type: 'reference' } : undefined

  if (!hostMemberId) {
    return sanityClient
      .patch(gatheringId)
      .unset([`occurrences[_key == "${occurrenceKey}"].host`])
      .commit({ autoGenerateArrayKeys: true })
  }

  return sanityClient
    .patch(gatheringId)
    .set({
      [`occurrences[_key == "${occurrenceKey}"].host`]: host,
    })
    .commit({ autoGenerateArrayKeys: true })
}

export const useApi = ({ gatheringId }) => {
  const setOccurrence = useCallback(
    async ({ date, hostMemberId }) => {
      const occurrenceKey = await getOccurrenceKey({ gatheringId, date })
      if (occurrenceKey) {
        return updateOccurrence({
          gatheringId,
          occurrenceKey,
          date,
          hostMemberId,
        })
      }

      return createOccurrence({ gatheringId, date, hostMemberId })
    },
    [gatheringId]
  )

  return { setOccurrence }
}

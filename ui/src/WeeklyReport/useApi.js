import groq from 'groq'
import { useCallback, useEffect, useState } from 'react'

import { mapGathering } from './utils'
import { sanityClient } from '../sanityClient'

const query = groq`
  *[_type == "gathering"] [] {  
    _id,
    title,
    slug {
      current
    }, 
    occurrences[date >= $startDate && date <= $endDate] {
      date,
      _key,
      attendances[]
    },
    "nextOccurrence": occurrences[date > $endDate] | order(date asc) {
      _key,
      date,
      host->{
        _id,
        name, 
        alias
      }     
    }[0]
  }
`

export const useApi = ({ startDate, endDate }) => {
  const [isLoading, setLoading] = useState(true)
  const [data, setData] = useState()

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const rawData = await sanityClient.fetch(query, {
        startDate,
        endDate,
      })
      const data = rawData.map(mapGathering)
      setData(data)
    } catch (e) {
      console.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  const subscribe = useCallback(
    () =>
      sanityClient.listen(query, { startDate, endDate }).subscribe((update) => {
        const rawGathering = update.result
        const index = data.findIndex(({ _id }) => _id === rawGathering._id)
        const occurrenceDates = data[index].occurrences.map(({ date }) => date)
        const gathering = mapGathering({
          ...rawGathering,
          occurrences: rawGathering.occurrences.filter(({ date }) => occurrenceDates.includes(date)),
        })

        const nextState = [...data.slice(0, index), gathering, ...data.slice(index + 1)]

        setData(nextState)
      }),
    [data, endDate, startDate]
  )

  useEffect(() => {
    const subscription = subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [subscribe])

  useEffect(() => {
    loadData()
  }, [loadData]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading }
}

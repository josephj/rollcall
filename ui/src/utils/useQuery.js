import groq from 'groq'
import { useEffect, useRef, useState } from 'react'

import { sanityClient } from '../sanityClient'

export const useQuery = (query, params) => {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const paramsRef = useRef(params)

  useEffect(() => {
    paramsRef.current = params
  }, [params])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await sanityClient.fetch(groq([query]), paramsRef.current)
        setData(response)
        setLoading(false)
      } catch (error) {
        throw error
      }
    }

    fetchData()
  }, [query])

  return { data, isLoading }
}

import { useQuery } from '../../utils/useQuery'

const QUERY = `
  *[_type == "gathering" && slug.current == $slug][0] { 
    occurrences[] {
      date,
      host->{
        _id,
      }
    }, 
    attendances,
    "members": *[_type == "member" && references(^._id)] | order(leader) {
      _id,
      name,
      alias,
    }
  }
`

export const useApi = ({ slug, date: currenDate }) => {
  const { data: gatheringData, isLoading } = useQuery(QUERY, {
    slug,
  })
  const usedDateStrings = gatheringData?.occurrences.map?.(({ date }) => date) || []
  const members = gatheringData?.members || []
  const currentOccurrence = gatheringData?.occurrences.find(({ date }) => date === currenDate)
  const hostMemberId = currentOccurrence?.host?._id

  return { usedDateStrings, members, hostMemberId, isLoading }
}

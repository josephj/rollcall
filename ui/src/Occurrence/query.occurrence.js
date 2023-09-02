import groq from 'groq'

export const occurrenceQuery = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
    recurrence,
    location,
    leader->{
      _id,
    },
    occurrences[date == $date] {
      _key,
      date,
      host->{
        _id
      },
      attendances[] {
        _key,
        member->{
          _id,
          name,
          alias,
        }
      },
    },
    "nextOccurrence": occurrences[date > $date] | order(date asc) {
      _key,
      date,
      host->{
        _id
      }     
    }[0],
    organization,
    "members": *[_type == "member" && references(^._id) && !(_id in path("drafts.**"))] | order(leader) {
      _id,
      name,
      alias,
    }
  }
`

export const occurrencesQuery = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    occurrences,
  }
`

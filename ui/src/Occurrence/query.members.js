import groq from 'groq'

export const membersQuery = groq`
  *[_type == "member" 
    // && !($gatheringId in gatherings[]._ref) 
  ] {
    _id,
    name,
    alias,
  }
`

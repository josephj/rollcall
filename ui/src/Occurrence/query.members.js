import groq from 'groq'

export const membersQuery = groq`
  *[_type == "member" && organizations[]->slug.current match $organizationSlug] {
    _id,
    name,
    alias,
  }
`

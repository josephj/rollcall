import groq from "groq";

export const occurrenceQuery = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
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
    organization,
    "members": *[_type == "member" && references(^._id)] | order(leader) {
      _id,
      name,
      alias,
    }
  }
`;

export const occurrencesQuery = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    occurrences,
  }
`;

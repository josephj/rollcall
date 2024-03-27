import { gql, useQuery } from '@apollo/client'
import { t } from '@lingui/macro'
import { Stack, Text } from 'native-base'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'

import { Card, Layout } from './components'

const GET_GATHERING_LIST = gql`
  query ($org: String!) {
    allGathering(where: { organization: { slug: { current: { eq: $org } } } }) {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`

export const Gatherings = () => {
  const { org } = useParams()
  const navigate = useNavigate()
  const { loading, data } = useQuery(GET_GATHERING_LIST, { variables: { org } })
  const gatherings = data?.allGathering || []

  return (
    <>
      <Helmet>
        <title>{org === 'efcglory' ? '榮益福音教會點名' : '雪梨台福教會點名'}</title>
      </Helmet>
      <Layout headerContent={t`Gatherings`} isLoading={loading}>
        <Stack space={5}>
          {gatherings.map(({ _id, title, name, slug }) => (
            <Card
              key={_id}
              minWidth="250px"
              onClick={() => navigate(`/${org}/gatherings/${slug.current}`)}
              textAlign="center"
            >
              <Text fontWeight="500">{title}</Text>
              <Text fontSize="11px">{name}</Text>
            </Card>
          ))}
        </Stack>
      </Layout>
    </>
  )
}

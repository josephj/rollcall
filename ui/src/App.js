import { gql, useQuery } from '@apollo/client'
import { Flex, Stack, Text } from 'native-base'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Layout } from './components'

const GET_GATHERING_LIST = gql`
  query {
    allOrganization {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`

export const App = () => {
  const { loading: isLoading, data } = useQuery(GET_GATHERING_LIST)
  const navigate = useNavigate()
  const organizations = data?.allOrganization || []

  useEffect(() => {
    const organizations = data?.allOrganization || []
    if (organizations.length === 1) {
      const [{ slug }] = organizations
      navigate(`/${slug.current}/gatherings`, { replace: true })
    }
  }, [data, navigate])

  const handleClick = (slug) => {
    navigate(`/${slug}/gatherings`)
  }

  const headerContent = (
    <Text fontSize="lg" fontWeight="500">
      Organizations
    </Text>
  )

  return (
    <Layout {...{ headerContent, isLoading }}>
      <Flex height="100%" justifyContent="center">
        <Stack space={5}>
          {organizations.map(({ _id, slug, name }) => (
            <Card key={_id} textAlign="center" minWidth="250px" onClick={() => handleClick(slug.current)}>
              <Text fontWeight="400">{name}</Text>
            </Card>
          ))}
        </Stack>
      </Flex>
    </Layout>
  )
}

export default App

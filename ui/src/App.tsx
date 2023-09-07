import { Flex, Stack, Text } from 'native-base'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Layout } from './components'
import { useAllOrganizationQuery } from './generated/hooks'

export const App = () => {
  const { loading: isLoading, data } = useAllOrganizationQuery()
  const navigate = useNavigate()
  const organizations = data?.allOrganization || []

  useEffect(() => {
    const organizations = data?.allOrganization || []
    if (organizations.length === 1) {
      const [{ slug }] = organizations
      navigate(`/${slug?.current}/gatherings`, { replace: true })
    }
  }, [data, navigate])

  const handleClick = (slug: string) => {
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
            // @ts-ignore
            <Card key={_id} minWidth="250px" onClick={() => handleClick(slug.current)} textAlign="center">
              <Text fontWeight="400">{name}</Text>
            </Card>
          ))}
        </Stack>
      </Flex>
    </Layout>
  )
}

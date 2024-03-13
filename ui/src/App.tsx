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
    const url = new URL(location.href)
    switch (url.host) {
      case 'checkin.efcsydney.org':
        navigate(`/efcsydney/gatherings`, { replace: true })
        break
      case 'checkin.efcglory.org':
        navigate(`/efcglory/gatherings`, { replace: true })
        break
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

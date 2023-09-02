import { t } from '@lingui/macro'
import groq from 'groq'
import { AddIcon, Fab, HStack, Skeleton, Stack, Text, useDisclose } from 'native-base'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AddModal } from './AddModal'
import { Info } from './Info'
import { List } from './List'
import { Layout } from '../components'
import { sanityClient } from '../sanityClient'

const query = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
    leader->{
      name,
      alias,
    },
    location,
    occurrences[] | order(date desc),
    recurrence,
    "members": *[_type == "member" && references(^._id)] | order(name) {
      _id,
      name,
      alias,
    }
  }
`

const queryOccurrenceDate = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    "occurrence": occurrences[date == $date][0] {
      _key
    }
  }
`

export const Gathering = () => {
  const { org, slug } = useParams()
  const [gathering, setGathering] = useState()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclose()

  useEffect(() => {
    const loadGathering = async () => {
      try {
        const gathering = await sanityClient.fetch(query, { slug })
        setGathering(gathering)
      } catch (e) {
        console.error(e.message)
      }
    }
    loadGathering()
  }, [slug])

  const { _id, title } = gathering || {}

  const handleCreate = async (date) => {
    const { occurrence } = await sanityClient.fetch(queryOccurrenceDate, {
      slug,
      date,
    })

    if (!occurrence) {
      await sanityClient
        .patch(_id)
        .setIfMissing({ occurrences: [] })
        .append('occurrences', [{ date, attendances: [], _type: 'occurrence' }])
        .commit({ autoGenerateArrayKeys: true })
    }

    navigate(`/${org}/gatherings/${slug}/${date}`)
  }

  const handleEdit = (date) => {
    navigate(`/${org}/gatherings/${slug}/${date}`)
  }

  const renderHeaderContent = () => {
    if (!title) {
      return (
        <HStack alignItems="center" space="3">
          <Text fontSize="lg" fontWeight="500">
            <Link to={`/${org}/gatherings`}>{t`Gatherings`}</Link>
          </Text>
          <Text color="gray.300">&gt;</Text>
          <Skeleton endColor="gray.200" h="5" my="1" rounded="sm" w="100" />
        </HStack>
      )
    }

    return (
      <HStack alignItems="center" space="3">
        <Link to={`/${org}/gatherings`}>{t`Gatherings`}</Link>
        <Text color="gray.300">&gt;</Text>
        <Text>{title}</Text>
      </HStack>
    )
  }

  return (
    <>
      <Layout headerContent={renderHeaderContent()} isLoading={!gathering}>
        <Stack space={5}>
          {gathering ? <Info {...{ gathering }} /> : null}
          <List onCreate={handleCreate} onEdit={handleEdit} {...{ gathering }} />
        </Stack>
        <Fab
          colorScheme="blue"
          icon={<AddIcon name="plus" size="sm" />}
          onPress={onOpen}
          renderInPortal={false}
          shadow={2}
          size="sm"
        />
      </Layout>
      <AddModal {...{ isOpen, onClose, slug }} />
    </>
  )
}

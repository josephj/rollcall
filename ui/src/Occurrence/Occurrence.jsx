import { Trans } from '@lingui/macro'
import { Divider, HStack, Stack, Skeleton, Text, useDisclose } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AddMemberModal } from './AddMemberModal'
import { EditModal } from './EditModal/'
import { AddButton } from './Elements'
import { List } from './List'
import { NextOccurrence } from './NextOccurrence'
import { useApi } from './useApi'
import { Layout } from '../components'
import { sanityClient } from '../sanityClient'

export const Occurrence = () => {
  const { slug, date, org, action } = useParams()
  const navigate = useNavigate()
  const [gathering, setGathering] = useState()
  const [isSaving, setSaving] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclose()
  const { addMember, createMember, fetchOccurrence, tickAttendance, updateAttendances, updateOccurrence } = useApi({
    date,
    slug,
  })

  const members = gathering?.members || []
  const occurrence = gathering?.occurrences?.[0]
  const occurrenceKey = occurrence?._key

  const loadGathering = useCallback(async () => {
    try {
      const gathering = await fetchOccurrence()
      setGathering(gathering)
    } catch (e) {
      console.error(e.message)
    }
  }, [fetchOccurrence])

  useEffect(() => {
    loadGathering()
  }, [date, fetchOccurrence, loadGathering, slug])

  const handleTickMember = useCallback(
    async ({ attendanceMemberIds }) => {
      const { _id: gatheringId, occurrences } = gathering || {}
      const [{ _key: occurrenceKey }] = occurrences || []
      await updateAttendances({
        gatheringId,
        occurrenceKey,
        attendanceMemberIds,
      })
      await loadGathering()
    },
    [gathering, loadGathering, updateAttendances]
  )

  const handleAddAttendee = async ({ memberId, isGatheringMember }) => {
    const { _id: gatheringId, occurrences } = gathering || {}
    const [{ _key: occurrenceKey }] = occurrences || []
    setSaving(true)
    if (isGatheringMember) {
      await addMember({ memberId, gatheringId })
    }
    await tickAttendance({ gatheringId, occurrenceKey, memberId })
    await loadGathering()
    setSaving(false)
    onClose()
  }

  const handleCreateMember = async ({ data, isGatheringMember }) => {
    const { name, alias, email } = data
    setSaving(true)
    const { _id: memberId } = await createMember({
      name,
      alias,
      email,
      organizationId: gathering.organization._ref,
    })
    await handleAddAttendee({ memberId, isGatheringMember })
    setSaving(false)
    onClose()
  }

  const handleCreateOccurrence = async () => {
    const { _id: gatheringId } = gathering || {}
    return sanityClient
      .patch(gatheringId)
      .setIfMissing({ occurrences: [] })
      .append('occurrences', [{ date, attendances: [], _type: 'occurrence' }])
      .commit({ autoGenerateArrayKeys: true })
  }

  const handleUpdate = async ({ selectedDate, hostMemberId }) => {
    await updateOccurrence({
      gatheringId: gathering?._id,
      prevDate: date,
      nextDate: selectedDate,
      hostMemberId,
    })

    navigate(`/${org}/gatherings/${slug}/${selectedDate}`)
  }

  const renderHeaderContent = () => {
    if (!gathering) {
      return (
        <HStack alignItems="center" space="3">
          <Skeleton endColor="gray.200" h="5" my="1" rounded="sm" w="120" />
          <Text color="gray.300">&gt;</Text>
          <Skeleton endColor="gray.200" h="5" my="1" rounded="sm" w="120" />
        </HStack>
      )
    }

    const { title } = gathering

    return (
      <HStack alignItems="center" space="3">
        <Link to={`/${org}/gatherings/${slug}`}>{title}</Link>
        <Text color="gray.300">&gt;</Text>
        <Text>{date}</Text>
        <Text fontSize="sm">
          (
          <Link to={`/${org}/gatherings/${slug}/${date}/edit`}>
            <Trans>Edit Occurrence</Trans>
          </Link>
          )
        </Text>
      </HStack>
    )
  }

  return (
    <>
      <Layout headerContent={renderHeaderContent()} isLoading={!gathering || isSaving}>
        <Stack space={5}>
          {gathering ? (
            <List
              onCreateOccurrence={handleCreateOccurrence}
              onTickMember={handleTickMember}
              onUpdate={() => loadGathering()}
              {...{ date, gathering, isSaving }}
            />
          ) : null}
          {occurrence ? (
            <>
              <Divider />
              <NextOccurrence {...{ gathering }} />
            </>
          ) : null}
        </Stack>
      </Layout>
      <AddButton onClick={onOpen} />
      <AddMemberModal
        gatheringId={gathering?._id}
        onCreateMember={handleCreateMember}
        onSelectMember={handleAddAttendee}
        {...{ isOpen, isSaving, onClose, occurrenceKey, members }}
      />
      <EditModal
        isOpen={action === 'edit'}
        onClose={() => navigate(`/${org}/gatherings/${slug}/${date}`)}
        onSave={handleUpdate}
        {...{ date, slug }}
      />
    </>
  )
}

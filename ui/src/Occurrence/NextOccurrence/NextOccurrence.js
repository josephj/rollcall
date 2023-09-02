import { t, Trans } from '@lingui/macro'
import { Link, VStack, Center, FormControl, Heading, Stack, useToast } from 'native-base'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select'

import { useApi } from './useApi'
import { getNextDate } from '../../Gathering/utils'

export const NextOccurrence = ({ gathering }) => {
  const { org, slug } = useParams()
  const { setOccurrence } = useApi({ gatheringId: gathering?._id })
  const toast = useToast()

  const { recurrence = '', nextOccurrence, occurrences } = gathering || {}
  const [isSaving, setSaving] = useState(false)

  if (!gathering) {
    return null
  }

  const occurrence = occurrences?.[0] || {}
  const nextDate = nextOccurrence?.date || getNextDate(recurrence, occurrence?.date)
  const options = gathering?.members.map(({ _id, name, alias }) => ({
    label: alias ? `${name} (${alias})` : name,
    value: _id,
  }))
  const nextHostMemberId = nextOccurrence?.host?._id
  const value = options.find(({ value }) => value === nextHostMemberId)

  const handleSetHost = async (selectedOption) => {
    const hostMemberId = selectedOption?.value
    setSaving(true)
    try {
      await setOccurrence({
        date: nextDate,
        hostMemberId,
      })
      toast.show({
        description: hostMemberId ? 'The host has been set' : 'The host has been removed',
        placement: 'top',
        isClosable: true,
      })
    } catch (e) {
      console.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Center paddingBottom="lg">
      <VStack paddingBottom="lg" space="md">
        <Heading size="sm" textAlign="center">
          <Trans>Next occurrence</Trans>
        </Heading>
        <Stack border="solid 1px #ccc" padding="md" space="md" textAlign="center">
          <FormControl>
            <FormControl.Label display="block">
              <Trans>Date</Trans>
            </FormControl.Label>
            <Center>
              <Link href={`/${org}/gatherings/${slug}/${nextDate}`} target="_blank">
                {nextDate}
              </Link>
            </Center>
          </FormControl>
          <FormControl>
            <FormControl.Label display="block">
              <Trans>Host</Trans>
            </FormControl.Label>
            <Select
              defaultValue={value}
              isClearable
              isDisabled={isSaving}
              isLoading={isSaving}
              menuPlacement="top"
              onChange={handleSetHost}
              placeholder={t`Select a member...`}
              {...{ options }}
            />
            <FormControl.HelperText>
              <Trans>Select the host for the next occurrence</Trans>
            </FormControl.HelperText>
          </FormControl>
        </Stack>
      </VStack>
    </Center>
  )
}

import { t } from '@lingui/macro'
import { Badge, Button, Box, Checkbox, HStack, Stack, Text } from 'native-base'
import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AttendanceMenu } from './AttendanceMenu'
import { Card } from '../components'

export const List = ({ date, gathering, onCreateOccurrence, onTickMember, onUpdate }) => {
  const { members = [], occurrences = [] } = gathering || {}
  const attendances = occurrences[0]?.attendances || []
  const attendanceMemberIds = attendances.map(({ member }) => member?._id)
  const { control, watch, handleSubmit } = useForm({
    defaultValues: { attendanceMemberIds },
  })
  const [groupValue] = useState(attendanceMemberIds)

  useEffect(() => {
    const subscription = watch(handleSubmit(onTickMember))
    return () => subscription.unsubscribe()
  }, [handleSubmit, onTickMember, watch])

  if (!gathering) {
    return null
  }

  if (!occurrences[0]) {
    return (
      <Stack space="md">
        <Text>The date does not exist. Do you want to create it?</Text>
        <Box textAlign="center">
          <Button onPress={() => onCreateOccurrence({ date })}>Create</Button>
        </Box>
      </Stack>
    )
  }

  const people = [...members, ...attendances.map(({ member }) => member)]
    .map(({ _id, name, alias }) => ({ _id, name, alias }))
    .reduce((result, person) => {
      const isDuplicate = result.some(({ _id }) => _id === person._id)
      if (!isDuplicate) {
        result.push(person)
      }
      return result
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

  const totalAttendances = watch('attendanceMemberIds').length

  return (
    <Stack space="sm">
      <Box
        alignSelf="center"
        bg="white"
        borderRadius="md"
        display="block"
        padding="10px"
        position="sticky"
        style={{
          boxShadow: '0 0 3px rgba(0, 0, 0, 0.1)',
        }}
        textAlign="center"
        top="0"
        width="100%"
        zIndex="1"
      >
        {t`Attendances: ${totalAttendances}`}
      </Box>
      <Controller
        name="attendanceMemberIds"
        render={({ field: { ref: _ref, ...field } }) => (
          <Checkbox.Group {...field}>
            <Stack space={5}>
              {people.map(({ _id: memberId, name, alias }) => {
                const isLeader = gathering?.leader?._id === memberId
                const hostMemberId = occurrences[0]?.host?._id
                const isHost = hostMemberId === memberId
                const isMember = members.some(({ _id }) => _id === memberId)
                return (
                  <Box key={memberId}>
                    <Checkbox size="lg" value={memberId}>
                      <Card minWidth="250px" textAlign="center">
                        <Stack space="2xs" textAlign="left">
                          <HStack space="2">
                            <Text fontWeight="500">{name}</Text>
                            <Text size="xsmall">{alias}</Text>
                            {isLeader ? <Text>⭐️</Text> : null}
                          </HStack>
                          <Stack display="inline-block" fontSize="11px" space="2xs">
                            {isHost ? <Badge colorScheme="warning" display="inline-block">{t`🎤 Host`}</Badge> : null}
                            {isMember ? <Badge colorScheme="info" display="inline-block">{t`👤 Member`}</Badge> : null}
                            {!isMember ? (
                              <Badge colorScheme="success" display="inline-block">{t`👋 Visitor`}</Badge>
                            ) : null}
                          </Stack>
                        </Stack>
                      </Card>
                    </Checkbox>
                    <Box position="absolute" right="-25px" top="45%">
                      <AttendanceMenu
                        gatheringId={gathering?._id}
                        isAttended={groupValue.includes(memberId)}
                        occurrenceKey={occurrences[0]?._key}
                        {...{ memberId, isMember, isLeader, isHost, onUpdate }}
                      />
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Checkbox.Group>
        )}
        {...{ control }}
      />
    </Stack>
  )
}

import { t } from '@lingui/macro'
import { Button, Checkbox, Divider, FormControl, Stack, HStack, Modal } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'

import { membersQuery } from './query.members'
import { HookInput } from '../components'
import { sanityClient } from '../sanityClient'

export const AddMemberModal = ({
  members: gatheringMembers,
  isOpen = true,
  isSaving = false,
  onCreateMember,
  onSelectMember,
  onClose,
}) => {
  const [options, setOptions] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [isCreating, setCreating] = useState(false)
  const [isGatheringMember, setGatheringMember] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const { control, handleSubmit, reset, setValue } = useForm()
  const { org: organizationSlug } = useParams()

  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null)
      reset()
    }
  }, [isOpen, reset, selectedOption])

  const fetchMembers = useCallback(async () => {
    const members = await sanityClient.fetch(membersQuery, {
      organizationSlug,
    })

    const options = members.map(({ name, alias, _id }) => ({
      value: _id,
      label: alias ? `${name} ${alias}` : name,
      isDisabled: gatheringMembers.some((member) => member._id === _id),
    }))

    setOptions(options)
    setLoading(false)
  }, [gatheringMembers, organizationSlug])

  const handleAddMember = (data) => {
    onCreateMember({ data, isGatheringMember })
  }

  const handleClose = () => {
    setCreating(false)
    onClose()
    reset()
  }

  const handleSelectMember = () => {
    const { value: memberId } = selectedOption
    onSelectMember({ memberId, isGatheringMember })
  }

  const handleCreateMember = async (name) => {
    setCreating(true)
    setValue('name', name)
  }

  const handleMenuOpen = async () => {
    setLoading(true)
    await fetchMembers()
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      maxHeight: '100px',
    }),
  }

  return (
    <Modal isOpen size="md" {...{ isOpen, onClose }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>{t`Add new attendee`}</Modal.Header>
        <Modal.Body minHeight="450px">
          <Stack space={5}>
            <FormControl>
              <HStack alignItems="center" space="xs">
                <Checkbox isChecked={isGatheringMember} onChange={setGatheringMember} value={true} />
                <FormControl.Label margin="0" onClick={() => setGatheringMember(!isGatheringMember)}>
                  {t`Member`}
                </FormControl.Label>
                <FormControl.HelperText margin="0">{t`Save the attendee as gathering member`}</FormControl.HelperText>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>{t`Attendee:`}</FormControl.Label>
              <CreatableSelect
                formatCreateLabel={(inputValue) => t`Create "${inputValue}"`}
                isClearable
                isDisabled={isCreating}
                loadingMessage={() => t`Loading...`}
                onChange={setSelectedOption}
                onCreateOption={handleCreateMember}
                onMenuOpen={handleMenuOpen}
                placeholder={t`Select or create a new attendee`}
                styles={customStyles}
                value={selectedOption}
                {...{ options, isLoading }}
              />
              <FormControl.HelperText>{t`Select from existing members or create a new one`}</FormControl.HelperText>
            </FormControl>
            {isCreating ? (
              <>
                <Divider />
                <form id="add-member-form" onSubmit={handleSubmit(handleAddMember)}>
                  <Stack space={5}>
                    <FormControl>
                      <FormControl.Label>{t`Name`}</FormControl.Label>
                      <HookInput
                        backgroundColor="white"
                        fontSize="13px"
                        name="name"
                        placeholder={t`English name (e.g. Jeffrey Wang)`}
                        type="text"
                        {...{ control }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>{t`Alias`}</FormControl.Label>
                      <HookInput
                        backgroundColor="white"
                        fontSize="13px"
                        name="alias"
                        placeholder={t`Chinese name (e.g. 王耀輝)`}
                        type="text"
                        {...{ control }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Email</FormControl.Label>
                      <HookInput
                        backgroundColor="white"
                        fontSize="13px"
                        name="email"
                        placeholder={t`e.g. abc@gmail.com`}
                        type="email"
                        {...{ control }}
                      />
                    </FormControl>
                  </Stack>
                </form>
              </>
            ) : null}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <HStack space="sm">
            <Button onPress={handleClose} variant="ghost">
              {t`Cancel`}
            </Button>
            <Button
              form="add-member-form"
              isDisabled={!isCreating ? !selectedOption : null}
              isLoading={isSaving}
              onPress={handleSubmit(isCreating ? handleAddMember : handleSelectMember)}
            >
              {t`Save`}
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

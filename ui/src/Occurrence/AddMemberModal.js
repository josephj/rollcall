import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  Stack,
  HStack,
  Modal,
} from "native-base";
import CreatableSelect from "react-select/creatable";

import { HookInput } from "../components";
import { sanityClient } from "../sanityClient";
import { membersQuery } from "./query.members";

export const AddMemberModal = ({
  gatheringId,
  members: gatheringMembers,
  occurrenceKey,
  isOpen = true,
  isSaving = false,
  onCreateMember,
  onSelectMember,
  onClose,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isGatheringMember, setGatheringMember] = useState(false);
  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const fetchMembers = useCallback(
    async ({ searchString = "" } = {}) => {
      const members = await sanityClient.fetch(membersQuery, {
        searchString: searchString.trim(),
        gatheringId,
        occurrenceKey,
      });

      const options = members.map(({ name, alias, _id }) => ({
        value: _id,
        label: alias ? `${name} ${alias}` : name,
        isDisabled: gatheringMembers.some((member) => member._id === _id),
      }));

      setOptions(options);
      setLoading(false);
    },
    [gatheringId, gatheringMembers, occurrenceKey]
  );

  const handleAddMember = (data) => {
    onCreateMember({ data, isGatheringMember });
  };

  const handleClose = () => {
    setCreating(false);
    onClose();
    reset();
  };

  const handleSelectMember = async ({ value: memberId }) => {
    onSelectMember({ memberId, isGatheringMember });
  };

  const handleCreateMember = async (name) => {
    setCreating(true);
    setValue("name", name);
  };

  const handleMenuOpen = async () => {
    setLoading(true);
    await fetchMembers();
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      maxHeight: "100px",
    }),
  };

  return (
    <Modal isOpen size="md" {...{ isOpen, onClose }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Add new attendee</Modal.Header>
        <Modal.Body minHeight="450px">
          <Stack space={5}>
            <FormControl>
              <HStack space="xs" alignItems="center">
                <Checkbox
                  isChecked={isGatheringMember}
                  onChange={setGatheringMember}
                  value={true}
                />
                <FormControl.Label
                  margin="0"
                  onClick={() => setGatheringMember(!isGatheringMember)}
                >
                  Member
                </FormControl.Label>
                <FormControl.HelperText margin="0">
                  Save the attendee as gathering member
                </FormControl.HelperText>
              </HStack>
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Attendee:</FormControl.Label>
              <CreatableSelect
                isDisabled={isCreating}
                isClearable
                onCreateOption={handleCreateMember}
                onChange={handleSelectMember}
                onMenuOpen={handleMenuOpen}
                styles={customStyles}
                {...{ options, isLoading }}
              />
              <FormControl.HelperText>
                Select from existing members or create a new one
              </FormControl.HelperText>
            </FormControl>
            {isCreating && (
              <>
                <Divider />
                <form
                  id="add-member-form"
                  onSubmit={handleSubmit(handleAddMember)}
                >
                  <Stack space={5}>
                    <FormControl>
                      <FormControl.Label>Name</FormControl.Label>
                      <HookInput
                        backgroundColor="white"
                        fontSize="13px"
                        name="name"
                        placeholder="English name (e.g. Jeffrey Wang)"
                        type="text"
                        {...{ control }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>Alias</FormControl.Label>
                      <HookInput
                        backgroundColor="white"
                        fontSize="13px"
                        name="alias"
                        placeholder="Chinese name (e.g. 王耀輝)"
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
                        placeholder="e.g. abc@gmail.com"
                        type="email"
                        {...{ control }}
                      />
                    </FormControl>
                  </Stack>
                </form>
              </>
            )}
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <HStack space="sm">
            <Button variant="ghost" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              form="add-member-form"
              isDisabled={!isCreating}
              isLoading={isSaving}
              onPress={handleSubmit(handleAddMember)}
            >
              Save
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

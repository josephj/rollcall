import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
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
  onMemberSelect,
  onClose,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isCreating, setCreating] = useState(false);
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

  const handleAddMember = (value) => {
    onCreateMember(value);
  };

  const handleClose = () => {
    setCreating(false);
    onClose();
    reset();
  };

  const handleMemberSelect = async ({ value: memberId }) => {
    onMemberSelect({ memberId });
    onClose();
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
        <Modal.Header>Add new member</Modal.Header>
        <Modal.Body minHeight="450px">
          <Stack space={5}>
            <CreatableSelect
              isDisabled={isCreating}
              isClearable
              onCreateOption={handleCreateMember}
              onChange={handleMemberSelect}
              onMenuOpen={handleMenuOpen}
              styles={customStyles}
              {...{ options, isLoading }}
            />
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
          <HStack>
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

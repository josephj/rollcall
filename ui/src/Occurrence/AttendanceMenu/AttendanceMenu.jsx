import { useState } from "react";
import {
  Button,
  Menu,
  Modal,
  Pressable,
  Stack,
  Text,
  ThreeDotsIcon,
  useDisclose,
  useToast,
} from "native-base";

import { useApi } from "./useApi";

export const AttendanceMenu = ({
  gatheringId,
  memberId,
  occurrenceKey,
  onUpdate,
  isAttended,
  isMember,
  isLeader,
  isHost,
}) => {
  const { isOpen, onClose, onOpen } = useDisclose();
  const [isConfirmVisible, setConfirmVisibility] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const toast = useToast();
  const { setAsMember, setAsHost, setAsLeader, setAsVisitor, unsetAsHost } =
    useApi({
      gatheringId,
      memberId,
      occurrenceKey,
    });

  const handleSetLeader = async () => {
    await setAsLeader();
    onUpdate();
    toast.show({
      description: "The attendance has been set to the group leader",
      isClosable: true,
    });
  };

  const handleSetVisitor = async () => {
    setSaving(true);
    await setAsVisitor();
    setSaving(false);
    setConfirmVisibility(false);
    onUpdate();
    toast.show({
      description: isAttended
        ? "The member is now a visitor"
        : "The member is removed from the gathering",
      isClosable: true,
    });
  };

  const handleSetMember = async () => {
    await setAsMember();
    onUpdate();
    toast.show({
      description: "The visitor is now a member",
      isClosable: true,
    });
  };

  const handleSetHost = async () => {
    await setAsHost();
    onUpdate();
    toast.show({
      description: "The attendance has been set to the occurrence host",
      isClosable: true,
    });
  };

  const handleUnsetHost = async () => {
    await unsetAsHost();
    onUpdate();
    toast.show({
      description: "The attendance has been removed from the host role",
      isClosable: true,
    });
  };

  return (
    <>
      <Menu
        trigger={(triggerProps) => (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <ThreeDotsIcon />
          </Pressable>
        )}
        {...{ isOpen, onClose, onOpen }}
      >
        {isOpen && (
          <>
            {!isMember && (
              <Menu.Item onPress={handleSetMember}>👤 Set as member</Menu.Item>
            )}
            {isMember && isAttended && (
              <Menu.Item onPress={handleSetVisitor}>
                👋 Set as visitor
              </Menu.Item>
            )}
            {!isHost && (
              <Menu.Item onPress={handleSetHost}>🎤 Set as host</Menu.Item>
            )}
            {!isLeader && isMember && (
              <Menu.Item onPress={handleSetLeader}>⭐️ Set as leader</Menu.Item>
            )}
            {isHost && (
              <Menu.Item onPress={handleUnsetHost}>
                🔇 Remove the host role
              </Menu.Item>
            )}
            {isMember && !isAttended && (
              <Menu.Item onPress={() => setConfirmVisibility(true)}>
                <Text color="red.500">🛑 Remove this member</Text>
              </Menu.Item>
            )}
          </>
        )}
      </Menu>
      <Modal
        isOpen={isConfirmVisible}
        onClose={() => setConfirmVisibility(false)}
      >
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Remove this member</Modal.Header>
          <Modal.Body>
            <Stack space="md" textAlign="center">
              <Text>This member won't appear in the future occurrence.</Text>
              <Text>Are you sure?</Text>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space="sm">
              <Button
                variant="ghost"
                onPress={() => setConfirmVisibility(false)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isSaving}
                onPress={handleSetVisitor}
              >
                Yes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

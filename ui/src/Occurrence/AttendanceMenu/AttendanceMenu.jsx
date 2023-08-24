import { useState } from "react";
import {
  Button,
  Menu,
  Modal,
  Pressable,
  Spinner,
  Stack,
  Text,
  ThreeDotsIcon,
  useDisclose,
  useToast,
} from "native-base";
import { t, Trans } from "@lingui/macro";

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
  const { setAsMember, setAsHost, setAsVisitor, unsetAsHost } = useApi({
    gatheringId,
    memberId,
    occurrenceKey,
  });

  const handleSetVisitor = async () => {
    setSaving(true);
    await setAsVisitor();
    setSaving(false);
    setConfirmVisibility(false);
    onUpdate();
    toast.show({
      description: isAttended
        ? t`The member is now a visitor`
        : t`The member is removed from the gathering`,
      isClosable: true,
    });
  };

  const handleSetMember = async () => {
    setSaving(true);
    await setAsMember();
    setSaving(false);
    onUpdate();
    toast.show({
      description: t`The visitor is now a member`,
      isClosable: true,
    });
  };

  const handleSetHost = async () => {
    setSaving(true);
    await setAsHost();
    setSaving(false);
    onUpdate();
    toast.show({
      description: t`The attendance has been set to the occurrence host`,
      isClosable: true,
    });
  };

  const handleUnsetHost = async () => {
    setSaving(true);
    await unsetAsHost();
    setSaving(false);
    onUpdate();
    toast.show({
      description: t`The attendance has been removed from the host role`,
      isClosable: true,
    });
  };

  return (
    <>
      <Menu
        trigger={(triggerProps) => (
          <Pressable
            accessibilityLabel="More options menu"
            isDisabled={isSaving}
            {...triggerProps}
          >
            {isSaving ? <Spinner color="gray.500" /> : <ThreeDotsIcon />}
          </Pressable>
        )}
        {...{ isOpen, onClose, onOpen }}
      >
        {isOpen && (
          <>
            {!isMember && (
              <Menu.Item onPress={handleSetMember}>
                👤<Trans>Set as member</Trans>
              </Menu.Item>
            )}
            {isMember && !isLeader && isAttended && (
              <Menu.Item onPress={handleSetVisitor}>
                👋<Trans>Set as visitor</Trans>
              </Menu.Item>
            )}
            {!isHost && (
              <Menu.Item onPress={handleSetHost}>
                🎤<Trans>Set as host</Trans>
              </Menu.Item>
            )}
            {isHost && (
              <Menu.Item onPress={handleUnsetHost}>
                🔇<Trans>Remove the host role</Trans>
              </Menu.Item>
            )}
            {isMember && !isLeader && !isAttended && (
              <Menu.Item onPress={() => setConfirmVisibility(true)}>
                ❌<Trans>Remove this member</Trans>
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
          <Modal.Header>
            <Trans>Remove this member</Trans>
          </Modal.Header>
          <Modal.Body>
            <Stack space="md" textAlign="center">
              <Text>
                <Trans>
                  This member won't appear in the future occurrence.
                </Trans>
              </Text>
              <Text>
                <Trans>Are you sure?</Trans>
              </Text>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space="sm">
              <Button
                variant="ghost"
                onPress={() => setConfirmVisibility(false)}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                colorScheme="red"
                isLoading={isSaving}
                onPress={handleSetVisitor}
              >
                <Trans>Yes</Trans>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

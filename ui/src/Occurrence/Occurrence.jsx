import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Box,
  Container,
  Checkbox,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclose,
} from "native-base";

import { Card, Header } from "../components";
import { AddMemberModal } from "./AddMemberModal";
import { AddButton } from "./Elements";
import { useApi } from "./useApi";

export const Occurrence = () => {
  const { slug, date, org } = useParams();
  const [gathering, setGathering] = useState();
  const [isSaving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const {
    addMember,
    createMember,
    fetchOccurrence,
    tickAttendance,
    untickAttendance,
  } = useApi({
    date,
    slug,
  });

  const loadGathering = useCallback(async () => {
    try {
      const gathering = await fetchOccurrence();
      setGathering(gathering);
    } catch (e) {
      console.error(e.message);
    }
  }, [fetchOccurrence]);

  useEffect(() => {
    loadGathering();
  }, [date, fetchOccurrence, loadGathering, slug]);

  if (!gathering) {
    return;
  }

  const {
    _id: gatheringId,
    title,
    occurrences,
    members = [],
  } = gathering || {};

  const [{ attendances = [], _key: occurrenceKey }] = occurrences || [];

  const memberIds = attendances.map(({ member }) => member?._ref);

  const handleCheckMember = async ({ memberId, attendanceKey }) => {
    const isAdding = !memberIds.includes(memberId);
    if (isAdding) {
      await tickAttendance({ gatheringId, occurrenceKey, memberId });
    } else {
      await untickAttendance({ gatheringId, occurrenceKey, attendanceKey });
    }
  };

  const handleAddMember = async ({ memberId }) => {
    setSaving(true);
    await addMember({ memberId, gatheringId });
    await tickAttendance({ gatheringId, occurrenceKey, memberId });
    await loadGathering();
    setSaving(false);
    onClose();
  };

  const handleCreateMember = async ({ name, alias, email }) => {
    setSaving(true);
    const { _id: memberId } = await createMember({
      name,
      alias,
      email,
      organizationId: gathering.organization._ref,
    });
    await handleAddMember({ memberId });
    setSaving(false);
    onClose();
  };

  return (
    <>
      <Stack flexDirection="column" height="100%" space={5}>
        <Header>
          <Text fontSize="lg" fontWeight="500">
            <Link to={`/${org}/gatherings/${slug}`}>
              {title} ({slug})
            </Link>{" "}
            &gt; {date}
          </Text>
        </Header>
        <Flex alignItems="center" justifyContent="flex-start" flexGrow="1">
          <Container>
            <Stack space={5}>
              <Box alignSelf="center" textAlign="center">
                <Text>Attendances: {attendances.length}</Text>
              </Box>
              <Stack space={5}>
                {members.map(({ _id: memberId, name, alias }) => (
                  <Card
                    key={memberId}
                    textAlign="center"
                    minWidth="250px"
                    onClick={() => {
                      const attendance = attendances.find(
                        ({ member }) => member._ref === memberId
                      );
                      const attendanceKey = attendance?._key;
                      handleCheckMember({
                        memberId,
                        attendanceKey,
                      });
                    }}
                  >
                    <Checkbox
                      defaultIsChecked={memberIds.includes(memberId)}
                      value={memberId}
                    >
                      <HStack space="2">
                        <Text fontWeight="500">{name}</Text>
                        <Text size="xsmall">{alias}</Text>
                      </HStack>
                    </Checkbox>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Container>
        </Flex>
      </Stack>
      <AddButton onClick={onOpen} />
      <AddMemberModal
        gatheringId={gathering._id}
        onCreateMember={handleCreateMember}
        onMemberSelect={handleAddMember}
        {...{ isOpen, isSaving, onClose, occurrenceKey, members }}
      />
    </>
  );
};

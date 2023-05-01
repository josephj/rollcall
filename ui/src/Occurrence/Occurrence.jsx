import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Box, HStack, Stack, Skeleton, Text, useDisclose } from "native-base";

import { Layout } from "../components";
import { AddMemberModal } from "./AddMemberModal";
import { List } from "./List";
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

  const handleTickMember = async ({ memberId, attendanceKey }) => {
    const { _id: gatheringId, occurrences } = gathering || {};
    const [{ attendances = [], _key: occurrenceKey }] = occurrences || [];
    const memberIds = attendances.map(({ member }) => member?._ref);
    const isAdding = !memberIds.includes(memberId);
    if (isAdding) {
      await tickAttendance({ gatheringId, occurrenceKey, memberId });
    } else {
      await untickAttendance({ gatheringId, occurrenceKey, attendanceKey });
    }
    await loadGathering();
  };

  const handleAddMember = async ({ memberId }) => {
    const { _id: gatheringId, occurrences } = gathering || {};
    const [{ _key: occurrenceKey }] = occurrences || [];
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

  const renderHeaderContent = () => {
    if (!gathering) {
      return (
        <HStack alignItems="center" space="3">
          <Skeleton w="120" h="5" rounded="sm" my="1" endColor="gray.200" />
          <Text color="gray.300">&gt;</Text>
          <Skeleton w="120" h="5" rounded="sm" my="1" endColor="gray.200" />
        </HStack>
      );
    }

    const { title } = gathering;

    return (
      <HStack alignItems="center" space="3">
        <Link to={`/${org}/gatherings/${slug}`}>{title}</Link>
        <Text color="gray.300">&gt;</Text>
        <Text>{date}</Text>
      </HStack>
    );
  };

  const members = gathering?.members || [];
  const occurrence = gathering?.occurrences?.[0];
  const occurrenceKey = occurrence?._key;
  const attendances = occurrence?.attendances || [];

  return (
    <>
      <Layout
        headerContent={renderHeaderContent()}
        isLoading={!gathering || isSaving}
      >
        <Stack space={5}>
          {attendances.length ? (
            <Box alignSelf="center" textAlign="center">
              <Text>Attendances: {attendances.length}</Text>
            </Box>
          ) : null}
          <List onTickMember={handleTickMember} {...{ gathering }} />
        </Stack>
      </Layout>
      <AddButton onClick={onOpen} />
      <AddMemberModal
        gatheringId={gathering?._id}
        onCreateMember={handleCreateMember}
        onMemberSelect={handleAddMember}
        {...{ isOpen, isSaving, onClose, occurrenceKey, members }}
      />
    </>
  );
};

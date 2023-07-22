import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Divider,
  HStack,
  Stack,
  Skeleton,
  Text,
  useDisclose,
  Heading,
  Center,
} from "native-base";

import { Layout } from "../components";
import { AddMemberModal } from "./AddMemberModal";
import { List } from "./List";
import { AddButton } from "./Elements";
import { useApi } from "./useApi";
import { sanityClient } from "../sanityClient";
import { EditModal } from "./EditModal/";

export const Occurrence = () => {
  const { slug, date, org, action } = useParams();
  const navigate = useNavigate();
  const [gathering, setGathering] = useState();
  const [total, setTotal] = useState(0);
  const [isSaving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const {
    addMember,
    createMember,
    fetchOccurrence,
    tickAttendance,
    updateAttendances,
    updateOccurrence,
  } = useApi({
    date,
    slug,
  });

  const members = gathering?.members || [];
  const occurrence = gathering?.occurrences?.[0];
  const occurrenceKey = occurrence?._key;
  const attendances = occurrence?.attendances || [];
  const attendancesTotal = attendances.length;

  useEffect(() => {
    setTotal(attendancesTotal);
  }, [attendancesTotal]);

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

  const handleTickMember = async ({ attendanceMemberIds }) => {
    const { _id: gatheringId, occurrences } = gathering || {};
    const [{ _key: occurrenceKey }] = occurrences || [];
    setTotal(attendanceMemberIds.length);
    await updateAttendances({
      gatheringId,
      occurrenceKey,
      attendanceMemberIds,
    });
    await loadGathering();
  };

  const handleAddAttendee = async ({ memberId, isGatheringMember }) => {
    const { _id: gatheringId, occurrences } = gathering || {};
    const [{ _key: occurrenceKey }] = occurrences || [];
    setSaving(true);
    if (isGatheringMember) {
      await addMember({ memberId, gatheringId });
    }
    await tickAttendance({ gatheringId, occurrenceKey, memberId });
    await loadGathering();
    setSaving(false);
    onClose();
  };

  const handleCreateMember = async ({ data, isGatheringMember }) => {
    const { name, alias, email } = data;
    setSaving(true);
    const { _id: memberId } = await createMember({
      name,
      alias,
      email,
      organizationId: gathering.organization._ref,
    });
    await handleAddAttendee({ memberId, isGatheringMember });
    setSaving(false);
    onClose();
  };

  const handleCreateOccurrence = async () => {
    const { _id: gatheringId } = gathering || {};
    return sanityClient
      .patch(gatheringId)
      .setIfMissing({ occurrences: [] })
      .append("occurrences", [{ date, attendances: [], _type: "occurrence" }])
      .commit({ autoGenerateArrayKeys: true });
  };

  const handleUpdate = async ({ selectedDate, hostMemberId }) => {
    await updateOccurrence({
      gatheringId: gathering?._id,
      prevDate: date,
      nextDate: selectedDate,
      hostMemberId,
    });

    navigate(`/${org}/gatherings/${slug}/${selectedDate}`);
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
        <Text fontSize="sm">
          (<Link to={`/${org}/gatherings/${slug}/${date}/edit`}>Edit</Link>)
        </Text>
      </HStack>
    );
  };

  return (
    <>
      <Layout
        headerContent={renderHeaderContent()}
        isLoading={!gathering || isSaving}
      >
        <Stack space={5}>
          <Box alignSelf="center" textAlign="center">
            <Text>Attendances: {total}</Text>
          </Box>
          <List
            onCreateOccurrence={handleCreateOccurrence}
            onTickMember={handleTickMember}
            {...{ date, gathering, isSaving }}
          />
          <Divider />
          <Center>
            <Heading size="sm">Next Occurrence</Heading>
            <Box fontSize="12px">
              <ul>
                <li>Date: DD/MM/YYYY</li>
                <li>Host: Hello World</li>
              </ul>
            </Box>
          </Center>
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
        isOpen={action === "edit"}
        onSave={handleUpdate}
        onClose={() => navigate(`/${org}/gatherings/${slug}/${date}`)}
        {...{ date, slug }}
      />
    </>
  );
};

import { useState, useEffect } from "react";
import { Badge, Button, Box, Checkbox, HStack, Stack, Text } from "native-base";

import { Card } from "../components";
import { AttendanceMenu } from "./AttendanceMenu";

export const List = ({
  date,
  gathering,
  onCreateOccurrence,
  onTickMember,
  onUpdate,
}) => {
  const { members = [], occurrences = [] } = gathering || {};
  const attendances = occurrences[0]?.attendances || [];
  const attendanceMemberIds = attendances.map(({ member }) => member?._id);
  const [groupValue, setGroupValues] = useState(attendanceMemberIds);

  useEffect(() => {
    const { occurrences = [] } = gathering || {};
    const attendances = occurrences[0]?.attendances || [];
    const attendanceMemberIds = attendances.map(({ member }) => member?._id);
    setGroupValues(attendanceMemberIds);
  }, [gathering]);

  if (!gathering) {
    return null;
  }

  if (!occurrences[0]) {
    return (
      <Stack space="md">
        <Text>The date does not exist. Do you want to create it?</Text>
        <Box textAlign="center">
          <Button onPress={() => onCreateOccurrence({ date })}>Create</Button>
        </Box>
      </Stack>
    );
  }

  const handleClickCard = (memberId) => {
    const attendance = attendances.find(
      ({ member }) => member._id === memberId
    );
    const attendanceKey = attendance?._key;

    setGroupValues((prevState) => {
      const isTicked = prevState.includes(memberId);
      const attendanceMemberIds = isTicked
        ? prevState.filter((id) => id !== memberId)
        : [...prevState, memberId];

      onTickMember({
        memberId,
        attendanceKey,
        attendanceMemberIds,
      });

      return attendanceMemberIds;
    });
  };

  const people = [...members, ...attendances.map(({ member }) => member)]
    .map(({ _id, name, alias }) => ({ _id, name, alias }))
    .reduce((result, person) => {
      const isDuplicate = result.some(({ _id }) => _id === person._id);
      if (!isDuplicate) {
        result.push(person);
      }
      return result;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Checkbox.Group value={groupValue}>
      <Stack space={5}>
        {people.map(({ _id: memberId, name, alias }) => {
          const isLeader = gathering?.leader?._id === memberId;
          const hostMemberId = occurrences[0]?.host?._id;
          const isHost = hostMemberId === memberId;
          const isMember = members.some(({ _id }) => _id === memberId);
          return (
            <HStack alignItems="center" key={memberId} space="sm">
              <Card
                minWidth="250px"
                textAlign="center"
                onClick={() => handleClickCard(memberId)}
              >
                <Checkbox size="lg" value={memberId}>
                  <Stack space="2xs" textAlign="left">
                    <HStack space="2">
                      <Text fontWeight="500">{name}</Text>
                      <Text size="xsmall">{alias}</Text>
                    </HStack>
                    <Stack space="xs">
                      {isLeader && (
                        <Badge
                          colorScheme="warning"
                          fontSize="11px"
                          width="110px"
                        >
                          <Text fontSize="11px">⭐️ Gathering leader</Text>
                        </Badge>
                      )}
                      {isHost && (
                        <Badge
                          colorScheme="warning"
                          fontSize="11px"
                          width="110px"
                        >
                          <Text fontSize="11px">🎤 Occurrence host</Text>
                        </Badge>
                      )}
                      {isMember && (
                        <Badge colorScheme="info" fontSize="11px" width="70px">
                          <Text fontSize="11px">👤 Member</Text>
                        </Badge>
                      )}
                      {!isMember && (
                        <Badge
                          colorScheme="success"
                          fontSize="11px"
                          width="70px"
                        >
                          <Text fontSize="11px">👋 Visitor</Text>
                        </Badge>
                      )}
                    </Stack>
                  </Stack>
                </Checkbox>
              </Card>
              <AttendanceMenu
                gatheringId={gathering?._id}
                occurrenceKey={occurrences[0]?._key}
                isAttended={groupValue.includes(memberId)}
                {...{ memberId, isMember, isLeader, isHost, onUpdate }}
              />
            </HStack>
          );
        })}
      </Stack>
    </Checkbox.Group>
  );
};

import { useState, useEffect } from "react";
import { Button, Box, Checkbox, HStack, Stack, Text } from "native-base";

import { Card } from "../components";

export const List = ({ date, gathering, onCreateOccurrence, onTickMember }) => {
  const { members = [], occurrences = [] } = gathering || {};
  const attendances = occurrences[0]?.attendances || [];
  const attendanceMemberIds = attendances.map(({ member }) => member?._ref);
  const [groupValue, setGroupValues] = useState(attendanceMemberIds);

  useEffect(() => {
    const { occurrences = [] } = gathering || {};
    const attendances = occurrences[0]?.attendances || [];
    const attendanceMemberIds = attendances.map(({ member }) => member?._ref);
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
      ({ member }) => member._ref === memberId
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

  return (
    <Checkbox.Group value={groupValue}>
      <Stack space={5}>
        {members.map(({ _id: memberId, name, alias }) => (
          <Card
            key={memberId}
            textAlign="center"
            minWidth="250px"
            onClick={() => handleClickCard(memberId)}
          >
            <Checkbox value={memberId}>
              <HStack space="2">
                <Text fontWeight="500">{name}</Text>
                <Text size="xsmall">{alias}</Text>
              </HStack>
            </Checkbox>
          </Card>
        ))}
      </Stack>
    </Checkbox.Group>
  );
};

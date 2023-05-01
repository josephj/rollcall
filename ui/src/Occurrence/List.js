import { Checkbox, HStack, Stack, Text } from "native-base";
import { Card } from "../components";

export const List = ({ gathering, onTickMember }) => {
  if (!gathering) {
    return null;
  }

  const { members = [], occurrences = [] } = gathering;
  const [{ attendances = [] }] = occurrences;
  const memberIds = attendances.map(({ member }) => member?._ref);

  return (
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
            onTickMember({
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
  );
};

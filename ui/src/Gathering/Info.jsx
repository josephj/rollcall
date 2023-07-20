import { Center, Text, VStack } from "native-base";
import { rrulestr } from "rrule";

export const Info = ({ gathering }) => {
  if (!gathering) {
    return null;
  }

  const { recurrence, location, leader } = gathering;
  const rrule = rrulestr(recurrence);

  return (
    <Center>
      <VStack>
        {location ? <Text>Location: {location}</Text> : null}
        {rrule.toText() ? <Text>Time: {rrule.toText()}</Text> : null}
        {leader ? (
          <Text>
            Leader: {leader.name} ({leader.alias})
          </Text>
        ) : null}
      </VStack>
    </Center>
  );
};

import { Box, Text } from "native-base";
import { rrulestr } from "rrule";

export const Info = ({ gathering }) => {
  if (!gathering) {
    return null;
  }

  const { recurrence, location } = gathering;
  const rrule = rrulestr(recurrence);

  return (
    <Box alignSelf="center" textAlign="center">
      <Text>{location}</Text>
      <Text>{rrule.toText()}</Text>
    </Box>
  );
};

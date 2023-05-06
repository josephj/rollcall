import { Heading, Stack, Text } from "native-base";
import { Card } from "../components";
import { getUpcomingDates } from "./utils";
import { rrulestr } from "rrule";

export const List = ({ gathering, onCreate, onEdit }) => {
  if (!gathering) {
    return null;
  }

  const { occurrences = [], recurrence } = gathering || {};
  const rrule = rrulestr(recurrence);
  const createdDates = occurrences.map(({ date }) => date);
  const notCreatedDates = getUpcomingDates({ rrule }).filter(
    (date) => !createdDates.includes(date)
  );

  return (
    <>
      {notCreatedDates.length ? (
        <Stack as="section" space="5">
          <Heading size="sm" textAlign="center">
            Not Established
          </Heading>
          <Stack space="5">
            {notCreatedDates.map((date) => (
              <Card
                key={date}
                textAlign="center"
                minWidth="250px"
                onClick={() => onCreate(date)}
              >
                <Text fontWeight="500">{date}</Text>
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}
      <hr />
      {createdDates.length ? (
        <Stack space="5">
          <Heading size="sm" textAlign="center">
            Established
          </Heading>
          <Stack space="5">
            {occurrences.map(({ _key, date, attendances = [] }) => (
              <Card
                key={_key}
                textAlign="center"
                minWidth="250px"
                onClick={() => onEdit(date)}
              >
                <Text fontSize="13" fontWeight="500">
                  {date}
                </Text>
                <Text fontSize="11">
                  Attendances:{" "}
                  <Text fontWeight="500">{attendances.length}</Text>
                </Text>
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}
    </>
  );
};

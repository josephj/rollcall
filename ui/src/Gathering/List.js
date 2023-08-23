import { useState } from "react";
import { Center, Heading, HStack, Spinner, Stack, Text } from "native-base";
import { Card } from "../components";
import { getUpcomingDates } from "./utils";
import { rrulestr } from "rrule";
import { t, Trans } from "@lingui/macro";

export const List = ({ gathering, onCreate, onEdit }) => {
  const [isCreating, setCreating] = useState(false);

  if (!gathering) {
    return null;
  }

  const { occurrences = [], recurrence } = gathering || {};
  const rrule = rrulestr(recurrence);
  const createdDates = occurrences?.map?.(({ date }) => date) || [];
  const notCreatedDates = getUpcomingDates({ rrule }).filter(
    (date) => !createdDates.includes(date),
  );

  const handleClickCreate = (date) => () => {
    if (!isCreating) {
      setCreating(true);
      onCreate(date);
    }
  };

  return (
    <>
      {notCreatedDates.length ? (
        <Stack as="section" space="5">
          <Heading size="sm" textAlign="center">
            <Trans>Not Established</Trans>
          </Heading>
          <Stack space="5">
            {notCreatedDates.map((date) => (
              <Card
                key={date}
                textAlign="center"
                minWidth="250px"
                isDisabled={isCreating}
                onClick={!isCreating && handleClickCreate(date)}
              >
                {isCreating ? (
                  <Center alignItems="center">
                    <HStack space="xs">
                      <Text fontWeight="500">Creating {date}</Text>
                      <Spinner color="gray.500" />
                    </HStack>
                  </Center>
                ) : (
                  <Text fontWeight="500">{date}</Text>
                )}
              </Card>
            ))}
          </Stack>
        </Stack>
      ) : null}
      <hr />
      {createdDates.length ? (
        <Stack space="5">
          <Heading size="sm" textAlign="center">
            <Trans>Established</Trans>
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
                  {t`Attendances:`}{" "}
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

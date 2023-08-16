import { useState } from "react";
import {
  Link,
  VStack,
  Center,
  FormControl,
  Heading,
  Stack,
  useToast,
} from "native-base";
import Select from "react-select";

import { useApi } from "./useApi";
import { getNextDate } from "../../Gathering/utils";
import { useParams } from "react-router-dom";

export const NextOccurrence = ({ gathering }) => {
  const { org, slug } = useParams();
  const { setOccurrence } = useApi({ gatheringId: gathering?._id });
  const toast = useToast();

  const { recurrence = "", nextOccurrence, occurrences } = gathering || {};
  const [isSaving, setSaving] = useState(false);

  if (!gathering) {
    return null;
  }

  const occurrence = occurrences?.[0] || {};
  const nextDate =
    nextOccurrence?.date || getNextDate(recurrence, occurrence?.date);
  const options = gathering?.members.map(({ _id, name, alias }) => ({
    label: alias ? `${name} (${alias})` : name,
    value: _id,
  }));
  const nextHostMemberId = nextOccurrence?.host?._id;
  const value = options.find(({ value }) => value === nextHostMemberId);

  const handleSetHost = async (selectedOption) => {
    const hostMemberId = selectedOption?.value;
    setSaving(true);
    try {
      await setOccurrence({
        date: nextDate,
        hostMemberId,
      });
      toast.show({
        description: hostMemberId
          ? "The host has been set"
          : "The host has been removed",
        placement: "top",
        isClosable: true,
      });
    } catch (e) {
      console.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Center paddingBottom="lg">
      <VStack space="md" paddingBottom="lg">
        <Heading size="sm" textAlign="center">
          Next occurrence
        </Heading>
        <Stack
          textAlign="center"
          space="md"
          border="solid 1px #ccc"
          padding="md"
        >
          <FormControl>
            <FormControl.Label display="block">Date</FormControl.Label>
            <Center>
              <Link
                href={`/${org}/gatherings/${slug}/${nextDate}`}
                target="_blank"
              >
                {nextDate}
              </Link>
            </Center>
          </FormControl>
          <FormControl>
            <FormControl.Label display="block">Host</FormControl.Label>
            <Select
              defaultValue={value}
              isClearable
              isDisabled={isSaving}
              isLoading={isSaving}
              onChange={handleSetHost}
              placeholder="Select a member..."
              menuPlacement="top"
              {...{ options }}
            />
            <FormControl.HelperText>
              Select the host for the next occurrence
            </FormControl.HelperText>
          </FormControl>
        </Stack>
      </VStack>
    </Center>
  );
};

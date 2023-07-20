import { useEffect, useState } from "react";
import Select from "react-select";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { Button, Center, Stack, HStack, Modal, FormControl } from "native-base";

import "react-day-picker/dist/style.css";
import "./style.css";
import { useApi } from "./useApi";

const DATE_FORMAT = "yyyy-MM-dd";

export const EditModal = ({ date, slug, isOpen = true, onClose, onSave }) => {
  const { usedDateStrings, members, hostMemberId, isLoading } = useApi({
    date,
    slug,
  });
  const [isSaving, setSaving] = useState(false);
  const initialDate = parse(date, DATE_FORMAT, new Date());
  const defaultMonth = initialDate;
  const [selectedDay, setSelectedDay] = useState(initialDate);
  const [selectedHostMemberId, setSelectedHostMemberId] =
    useState(hostMemberId);

  useEffect(() => {
    setSelectedHostMemberId(hostMemberId);
  }, [hostMemberId]);

  const handleSave = async () => {
    setSaving(true);
    const selectedDate = format(selectedDay, DATE_FORMAT);
    if (date === selectedDate) {
      onClose();
    }
    await onSave({ selectedDate, hostMemberId: selectedHostMemberId });
    setSaving(false);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleChangeHost = ({ value }) => {
    setSelectedHostMemberId(value);
  };

  if (isLoading) {
    return null;
  }

  const disabledDays = usedDateStrings
    .filter((usedDateString) => date !== usedDateString)
    .map((usedDateString) => parse(usedDateString, DATE_FORMAT, new Date()));

  const options = members.map(({ _id, name, alias }) => ({
    label: alias ? `${name} (${alias})` : name,
    value: _id,
  }));

  const value = options.find(({ value }) => value === selectedHostMemberId);

  return (
    <Modal size="md" onClose={handleClose} {...{ isOpen }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Edit occurrence</Modal.Header>
        <Modal.Body>
          <Center>
            <Stack space="md">
              <FormControl isRequired>
                <FormControl.Label>Date</FormControl.Label>
                <DayPicker
                  mode="single"
                  disabled={disabledDays}
                  selected={selectedDay}
                  onSelect={setSelectedDay}
                  {...{ defaultMonth }}
                />
                <FormControl.HelperText>
                  Select any dates that are not already used.
                </FormControl.HelperText>
              </FormControl>
              <FormControl>
                <FormControl.Label>Host</FormControl.Label>
                <Select
                  isClearable
                  onChange={handleChangeHost}
                  {...{ options, value, isLoading }}
                />
                <FormControl.HelperText>
                  Select the host for this occurrence.
                </FormControl.HelperText>
              </FormControl>
            </Stack>
          </Center>
        </Modal.Body>
        <Modal.Footer>
          <HStack space="sm">
            <Button variant="ghost" onPress={handleClose}>
              Cancel
            </Button>
            <Button isLoading={isSaving} onPress={handleSave}>
              Save
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

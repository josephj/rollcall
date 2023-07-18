import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { Button, Stack, HStack, Modal } from "native-base";

import "react-day-picker/dist/style.css";
import "./style.css";
import { useApi } from "./useApi";

const DATE_FORMAT = "yyyy-MM-dd";

export const EditModal = ({ date, slug, isOpen = true, onClose, onSave }) => {
  const { usedDateStrings, isLoading } = useApi({ slug });
  const [isSaving, setSaving] = useState(false);
  const initialDate = parse(date, DATE_FORMAT, new Date());
  const defaultMonth = initialDate;
  const [selectedDay, setSelectedDay] = useState(initialDate);

  const handleSave = async () => {
    setSaving(true);
    const selectedDateString = format(selectedDay, DATE_FORMAT);
    if (date === selectedDateString) {
      onClose();
    }
    await onSave(selectedDateString);
    setSaving(false);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (isLoading) {
    return null;
  }

  const disabledDays = usedDateStrings
    .filter((usedDateString) => date !== usedDateString)
    .map((usedDateString) => parse(usedDateString, DATE_FORMAT, new Date()));

  return (
    <Modal size="md" onClose={handleClose} {...{ isOpen }}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Choose date</Modal.Header>
        <Modal.Body>
          <Stack space={5}>
            <DayPicker
              mode="single"
              disabled={disabledDays}
              selected={selectedDay}
              onSelect={setSelectedDay}
              {...{ defaultMonth }}
            />
          </Stack>
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

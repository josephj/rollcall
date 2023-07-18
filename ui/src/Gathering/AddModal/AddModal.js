import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { Button, Stack, HStack, Modal } from "native-base";

import { useApi } from "./useApi";

import "react-day-picker/dist/style.css";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";

const DATE_FORMAT = "yyyy-MM-dd";

export const AddModal = ({ isOpen, onClose }) => {
  const { org, slug } = useParams();
  const navigate = useNavigate();
  const { usedDateStrings, isLoading, createOccurrence } = useApi({ slug });
  const [isSaving, setSaving] = useState(false);
  const initialDate = new Date();
  const defaultMonth = initialDate;
  const [selectedDay, setSelectedDay] = useState(initialDate);

  const handleCreate = async () => {
    setSaving(true);
    const date = format(selectedDay, DATE_FORMAT);
    await createOccurrence({ date });
    setSaving(false);

    navigate(`/${org}/gatherings/${slug}/${date}`);
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  if (isLoading) {
    return null;
  }

  const disabledDays = usedDateStrings.map((usedDateString) =>
    parse(usedDateString, DATE_FORMAT, new Date())
  );

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
            <Button isLoading={isSaving} onPress={handleCreate}>
              Create
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

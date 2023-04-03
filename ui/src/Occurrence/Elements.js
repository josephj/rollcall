import { AddIcon, Button, HStack, IconButton, Modal  } from "native-base";
import CreatableSelect from 'react-select/creatable';

export const AddButton = ({ onClick }) => (
  <IconButton
    borderRadius="full"
    bottom="20px"
    colorScheme="blue"
    icon={<AddIcon />}
    position="fixed"
    right="20px"
    variant="solid"
    width="50px"
    height="50px"
    onPress={onClick}
  />
);

export const AddMemberModal = ({ isOpen = true, onClose }) => {

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return <Modal isOpen size="md" {...{ isOpen, onClose }}>
    <Modal.Content>
      <Modal.CloseButton />
      <Modal.Header>Add New Member</Modal.Header>
      <Modal.Body>
        <CreatableSelect isClearable {...{options}} />
      </Modal.Body>
      <Modal.Footer>
        <HStack>
          <Button variant="ghost" onPress={onClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
};

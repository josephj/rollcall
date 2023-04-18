import { AddIcon, IconButton } from "native-base";

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

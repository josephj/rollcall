import { AddIcon, IconButton } from 'native-base'

export const AddButton = ({ onClick }) => (
  <IconButton
    borderRadius="full"
    bottom="20px"
    colorScheme="blue"
    height="50px"
    icon={<AddIcon />}
    onPress={onClick}
    position="fixed"
    right="20px"
    variant="solid"
    width="50px"
  />
)

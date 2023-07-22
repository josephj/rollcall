import {
  Menu,
  Pressable,
  ThreeDotsIcon,
  useDisclose,
  useToast,
} from "native-base";

export const AttendanceMenu = ({
  gatheringId,
  memberId,
  occurrenceKey,
  isMember,
  isLeader,
  isHost,
}) => {
  const { isOpen, onClose, onOpen } = useDisclose();
  const toast = useToast();

  console.log("=>(AttendanceMenu.jsx:21) memberId", memberId);
  console.log("=>(AttendanceMenu.jsx:21) gatheringId", gatheringId);
  console.log("=>(AttendanceMenu.jsx:24) occurrenceKey", occurrenceKey);

  const handleClick = () => {
    toast.show({
      title: "Under construction",
      description: "Coming soon!",
      variant: "solid",
      isClosable: true,
    });
  };

  return (
    <Menu
      trigger={(triggerProps) => (
        <Pressable accessibilityLabel="More options menu" {...triggerProps}>
          <ThreeDotsIcon />
        </Pressable>
      )}
      {...{ isOpen, onClose, onOpen }}
    >
      {isOpen && (
        <>
          {(!isMember || isLeader) && (
            <Menu.Item onPress={handleClick}>👤 Set as member</Menu.Item>
          )}
          {isMember && (
            <Menu.Item onPress={handleClick}>👋 Set as visitor</Menu.Item>
          )}
          {!isHost && (
            <Menu.Item onPress={handleClick}>🎤 Set as host</Menu.Item>
          )}
          {!isLeader && isMember && (
            <Menu.Item onPress={handleClick}>⭐️ Set as leader</Menu.Item>
          )}
        </>
      )}
    </Menu>
  );
};

import { Flex, HStack, Spinner, Text } from "native-base";

export const LoadingSpinner = ({ isOverlay = false }) => {
  const styles = isOverlay
    ? {
        bgColor: "gray.50",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        opacity: 0.5,
        position: "absolute",
      }
    : { height: "100%" };

  return (
    <Flex alignItems="center" justifyContent="center" {...styles}>
      <HStack alignItems="center" space={2} justifyContent="center">
        <Spinner color="gray.500" />
        <Text fontSize="md">Loading...</Text>
      </HStack>
    </Flex>
  );
};

import { Alert, Flex, HStack, Text, InfoIcon } from "native-base";

import { Header } from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";

export const Layout = ({ headerContent, children, isLoading }) => {
  const isDevelopment = process.env.REACT_APP_DATA_SET !== "production";
  return (
    <Flex flexDirection="column" height="100%">
      {headerContent && <Header>{headerContent}</Header>}
      <Flex
        alignItems="center"
        height="0"
        justifyContent="flex-start"
        flexGrow="1"
        flexShrink="1"
        overflow="auto"
        paddingY="5"
        position="relative"
      >
        {isDevelopment && (
          <Alert
            variant="left-accent"
            colorScheme="info"
            width="300px"
            marginBottom={5}
          >
            <HStack space={2} alignItems="center">
              <InfoIcon color="blue.400" />
              <Text flexGrow={1}>You are using the testing site.</Text>
            </HStack>
          </Alert>
        )}
        {children}
        {isLoading && <LoadingSpinner isOverlay />}
      </Flex>
    </Flex>
  );
};

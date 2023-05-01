import { Flex } from "native-base";

import { Header } from "./Header";
import { LoadingSpinner } from "./LoadingSpinner";

export const Layout = ({ headerContent, children, isLoading }) => {
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
        {children}
        {isLoading && <LoadingSpinner isOverlay />}
      </Flex>
    </Flex>
  );
};

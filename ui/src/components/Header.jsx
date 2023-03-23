import { Flex } from "native-base";

export const Header = ({ children }) => (
  <Flex
    alignItems="center"
    borderStyle="solid"
    borderWidth="1px"
    borderColor="coolGray.200"
    justifyContent="center"
    padding={5}
  >
    {children}
  </Flex>
);

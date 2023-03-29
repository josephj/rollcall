import { Flex } from "native-base";

export const Header = ({ children }) => (
  <Flex
    alignItems="center"
    background="coolGray.50"
    borderStyle="solid"
    borderWidth="1px"
    borderColor="coolGray.200"
    justifyContent="center"
    padding={5}
  >
    {children}
  </Flex>
);

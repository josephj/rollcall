import { Flex } from "native-base";

export const Header = ({ children, ...otherProps }) => (
  <Flex
    alignItems="center"
    backgroundColor="coolGray.50"
    borderStyle="solid"
    borderWidth="1px"
    data-testid="header"
    borderColor="coolGray.200"
    justifyContent="center"
    padding={5}
    {...otherProps}
  >
    {children}
  </Flex>
);

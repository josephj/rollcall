import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Menu,
  HamburgerIcon,
  Pressable,
  Text,
} from "native-base";

export const Header = ({ children, ...otherProps }) => {
  const { org } = useParams();
  const navigate = useNavigate();

  return (
    <Flex
      alignItems="center"
      backgroundColor="coolGray.50"
      borderStyle="solid"
      borderWidth="1px"
      data-testid="header"
      borderColor="coolGray.200"
      justifyContent="center"
      position="relative"
      padding={5}
      {...otherProps}
    >
      <Box position="absolute" left="5" top="5">
        <Menu
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
              >
                <HamburgerIcon size="lg" />
              </Pressable>
            );
          }}
        >
          <Menu.Item>
            <Button
              padding="0"
              variant="unstyled"
              onPress={() => navigate("/")}
            >
              Home
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              padding="0"
              variant="unstyled"
              onPress={() => navigate(`/${org}/weekly-statistics`)}
            >
              Weekly Statistics
            </Button>
          </Menu.Item>
        </Menu>
      </Box>
      <Text fontSize="lg" fontWeight="500">
        {children}
      </Text>
    </Flex>
  );
};

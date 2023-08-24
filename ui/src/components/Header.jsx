import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Menu,
  HamburgerIcon,
  Pressable,
  Text,
  Divider,
} from "native-base";
import { t } from "@lingui/macro";

import { AVAILABLE_LOCALES, getLocale } from "../i18n";

const currentLocale = getLocale();
console.log("=>(Header.jsx:17) currentLocale", currentLocale);
const availableLocales = Object.keys(AVAILABLE_LOCALES)
  .filter((key) => key !== currentLocale)
  .map((key) => ({
    value: key,
    label: AVAILABLE_LOCALES[key],
  }));

export const Header = ({ children, ...otherProps }) => {
  const { org } = useParams();
  const navigate = useNavigate();

  const handleSwitchLocale = (locale) => () => {
    const [url] = window.location.href.split("?");
    window.location.href = `${url}?lang=${locale}`;
  };

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
              {t`Home`}
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              padding="0"
              variant="unstyled"
              onPress={() => navigate(`/${org}/weekly-report`)}
            >
              {t`Weekly Report`}
            </Button>
          </Menu.Item>
          <Divider />
          {availableLocales.map(({ label, value }) => (
            <Menu.Item>
              <Button
                padding="0"
                variant="unstyled"
                onPress={handleSwitchLocale(value)}
              >
                {label}
              </Button>
            </Menu.Item>
          ))}
        </Menu>
      </Box>
      <Text fontSize="lg" fontWeight="500">
        {children}
      </Text>
    </Flex>
  );
};

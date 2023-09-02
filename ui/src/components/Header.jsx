import { t } from '@lingui/macro'
import { Box, Button, Flex, Menu, HamburgerIcon, Pressable, Text, Divider } from 'native-base'
import { useNavigate, useParams } from 'react-router-dom'

import { AVAILABLE_LOCALES, getLocale } from '../i18n'

const currentLocale = getLocale()

const availableLocales = Object.keys(AVAILABLE_LOCALES)
  .filter((key) => key !== currentLocale)
  .map((key) => ({
    value: key,
    label: AVAILABLE_LOCALES[key],
  }))

export const Header = ({ children, ...otherProps }) => {
  const { org } = useParams()
  const navigate = useNavigate()

  const handleSwitchLocale = (locale) => () => {
    const [url] = window.location.href.split('?')
    window.location.href = `${url}?lang=${locale}`
  }

  return (
    <Flex
      alignItems="center"
      backgroundColor="coolGray.50"
      borderColor="coolGray.200"
      borderStyle="solid"
      borderWidth="1px"
      data-testid="header"
      justifyContent="center"
      padding={5}
      position="relative"
      {...otherProps}
    >
      <Box left="5" position="absolute" top="5">
        <Menu
          trigger={(triggerProps) => (
              <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <HamburgerIcon size="lg" />
              </Pressable>
            )}
        >
          <Menu.Item>
            <Button onPress={() => navigate('/')} padding="0" variant="unstyled">
              {t`Home`}
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button onPress={() => navigate(`/${org}/weekly-report`)} padding="0" variant="unstyled">
              {t`Weekly Report`}
            </Button>
          </Menu.Item>
          <Divider />
          {availableLocales.map(({ label, value }) => (
            <Menu.Item>
              <Button onPress={handleSwitchLocale(value)} padding="0" variant="unstyled">
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
  )
}

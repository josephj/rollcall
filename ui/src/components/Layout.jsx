import { Trans } from '@lingui/macro'
import { Alert, Flex, HStack, InfoIcon } from 'native-base'

import { Header } from './Header'
import { LoadingSpinner } from './LoadingSpinner'

export const Layout = ({ headerContent, children, isLoading }) => {
  const isDevelopment = process.env.REACT_APP_DATA_SET !== 'production'
  return (
    <Flex flexDirection="column" height="100%">
      {headerContent ? <Header>{headerContent}</Header> : null}
      <Flex
        alignItems="center"
        flexGrow="1"
        flexShrink="1"
        height="0"
        justifyContent="flex-start"
        overflow="auto"
        paddingY="5"
        position="relative"
      >
        {isDevelopment ? <Alert colorScheme="info" marginBottom={5} variant="left-accent" width="300px">
            <HStack alignItems="center" space={2}>
              <InfoIcon color="blue.400" />
              <Trans flexGrow={1}>You are using the testing site.</Trans>
            </HStack>
                         </Alert> : null}
        {children}
        {isLoading ? <LoadingSpinner isOverlay /> : null}
      </Flex>
    </Flex>
  )
}

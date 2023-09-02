import { t, Trans } from '@lingui/macro'
import { Center, Text, VStack } from 'native-base'
import { rrulestr } from 'rrule'

import { NameAlias } from '../components/name-alias'
// @ts-ignore
import type * as Schema from '../sanity-codegen'

type Props = {
  gathering: Schema.Gathering
}

export const Info = ({ gathering }: Props) => {
  const { recurrence, location, leader } = gathering
  const rrule = rrulestr(recurrence)

  return (
    <Center>
      <VStack space="sm" textAlign="center">
        {location ? (
          <Text>
            {t`Location:`} {location}
          </Text>
        ) : null}
        {rrule.toText() ? (
          <Text>
            {t`Time:`} {rrule.toText()}
          </Text>
        ) : null}
        {leader ? (
          <Text>
            <Trans>Leader:</Trans> <NameAlias alias={leader.alias} name={leader.name} />
          </Text>
        ) : null}
      </VStack>
    </Center>
  )
}

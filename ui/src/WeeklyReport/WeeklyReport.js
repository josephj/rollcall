import { t, Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Box, Center, Divider, FlatList, HStack, Stack, Text } from 'native-base'
import { Link, useParams } from 'react-router-dom'
import 'dayjs/locale/en'

import { useApi } from './useApi'
import { getReportStartEndDateTimes } from './utils'
import { Layout } from '../components'

dayjs.extend(localizedFormat)
dayjs.locale('en')

export const WeeklyReport = () => {
  const { org, startDate: paramStartDate } = useParams()
  const { startDateTime, endDateTime } = getReportStartEndDateTimes(paramStartDate)
  const startDate = startDateTime.format('YYYY-MM-DD')
  const endDate = endDateTime.format('YYYY-MM-DD')
  const { data, isLoading } = useApi({
    startDate,
    endDate,
    orgnizationSlug: org,
  })

  const prevStartDate = startDateTime.subtract(1, 'week').format('YYYY-MM-DD')
  const nextStartDate = startDateTime.add(1, 'week').format('YYYY-MM-DD')
  const isNextWeekDisabled = dayjs(nextStartDate) > dayjs()

  const gatherings =
    data?.map((item) => ({
      id: item._id,
      ...item,
    })) || []

  return (
    <Layout headerContent={t`Weekly Report`} {...{ isLoading }}>
      <Stack space="lg">
        <Center>
          <Stack space="2">
            <HStack space="2">
              <Trans>From:</Trans>
              <Text>{startDateTime.format('LLLL')}</Text>
            </HStack>
            <HStack space="2">
              <Trans>To:</Trans>
              <Text>{endDateTime.format('LLLL')}</Text>
            </HStack>
          </Stack>
        </Center>

        <FlatList
          data={gatherings}
          renderItem={({ index, item }) => (
            <HStack key={item._id} py="1" space="2">
              <Text textAlign="right" width="10">
                {index + 1}.
              </Text>
              <Stack space="2xs">
                <HStack space="2">
                  <Text>
                    <Link to={`/${org}/gatherings/${item.slug?.current}`}>{item.title}</Link> :
                  </Text>
                  <Text>{item.total}</Text>
                  <HStack>
                    {item.total > 0 ? (
                      <>
                        (
                        <HStack divider={<Text>|</Text>} space="2xs">
                          {item.occurrences.map(({ date, _key, attendances }) => (
                            <Text fontSize="sm" key={_key}>
                              <Link to={`/${org}/gatherings/${item.slug?.current}/${date}`}>{date}</Link>
                            </Text>
                          ))}
                        </HStack>
                        )
                      </>
                    ) : null}
                  </HStack>
                </HStack>
                {!!item?.nextOccurrence?.host ? (
                  <HStack fontSize="xs" space="2xs">
                    <Text fontWeight="semibold">{t`Next host:`}</Text>
                    <Text>{item.nextOccurrence.host.name}</Text>
                    {item.nextOccurrence.host.alias ? <Text>({item.nextOccurrence.host.alias})</Text> : null}
                  </HStack>
                ) : (
                  <Box height="15px" />
                )}
              </Stack>
            </HStack>
          )}
        />
        <Divider />
        <Center>
          <HStack alignItems="center" fontSize="sm" space="md">
            <Link to={`/${org}/weekly-report/${prevStartDate}`}>{t`Previous week`}</Link>
            <Divider orientation="vertical" />
            {isNextWeekDisabled ? (
              <Text color="gray.500">{t`Next week`}</Text>
            ) : (
              <Link isDisabled={isNextWeekDisabled} to={`/${org}/weekly-report/${nextStartDate}`}>
                {t`Next week`}
              </Link>
            )}
          </HStack>
        </Center>
      </Stack>
    </Layout>
  )
}

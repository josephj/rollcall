import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { Box, Center, FlatList, HStack, Stack, Text } from "native-base";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";

import { Layout } from "../components";
import { getReportStartEndDateTimes } from "./utils";
import { useApi } from "./useApi";

dayjs.extend(localizedFormat);
dayjs.locale("en");

export const WeeklyReport = () => {
  const { org } = useParams();
  const { startDateTime, endDateTime } = getReportStartEndDateTimes();
  const startDate = startDateTime.format("YYYY-MM-DD");
  const endDate = endDateTime.format("YYYY-MM-DD");
  const { data, isLoading } = useApi({
    startDate,
    endDate,
  });

  const gatherings =
    data?.map((item) => ({
      id: item._id,
      ...item,
    })) || [];

  return (
    <Layout headerContent="Weekly Report" {...{ isLoading }}>
      <Stack space="10">
        <Center>
          <Stack space="2">
            <HStack space="2">
              <Text>From:</Text>
              <Text>{startDateTime.format("LLLL")}</Text>
            </HStack>
            <HStack space="2">
              <Text>To:</Text>
              <Text>{endDateTime.format("LLLL")}</Text>
            </HStack>
          </Stack>
        </Center>
        <FlatList
          data={gatherings}
          renderItem={({ index, item }) => (
            <HStack py="1" space="2" key={item._id}>
              <Text textAlign="right" width="10">
                {index + 1}.
              </Text>
              <Stack space="2xs">
                <HStack space="2">
                  <Text>
                    <Link to={`/${org}/gatherings/${item.slug?.current}`}>
                      {item.title}
                    </Link>{" "}
                    :
                  </Text>
                  <Text>{item.total}</Text>
                  <HStack>
                    {item.total > 0 && (
                      <>
                        (
                        <HStack space="2xs" divider={<Text>|</Text>}>
                          {item.occurrences.map(
                            ({ date, _key, attendances }) => (
                              <Text fontSize="sm" key={_key}>
                                <Link
                                  to={`/${org}/gatherings/${item.slug?.current}/${date}`}
                                >
                                  {date}
                                </Link>
                              </Text>
                            )
                          )}
                        </HStack>
                        )
                      </>
                    )}
                  </HStack>
                </HStack>
                {!!item?.nextOccurrence?.host ? (
                  <HStack space="2xs" fontSize="xs">
                    <Text fontWeight="semibold">Next host:</Text>
                    <Text>{item.nextOccurrence.host.name}</Text>
                    {!!item.nextOccurrence.host.alias && (
                      <Text>({item.nextOccurrence.host.alias})</Text>
                    )}
                  </HStack>
                ) : (
                  <Box height="15px" />
                )}
              </Stack>
            </HStack>
          )}
        />
      </Stack>
    </Layout>
  );
};

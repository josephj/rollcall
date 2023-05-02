import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { FlatList, HStack, Stack, Text } from "native-base";
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
  const { data: gatherings, isLoading } = useApi({
    startDate,
    endDate,
  });

  return (
    <Layout headerContent="Weekly Report" {...{ isLoading }}>
      <Text fontSize="md">
        <Stack space="10">
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
          <FlatList
            data={gatherings}
            renderItem={({ index, item }) => (
              <HStack key={item._id} py="1" space="2">
                <Text textAlign="right" width="10">
                  {index + 1}.
                </Text>
                <Text>
                  <Link to={`/${org}/gatherings/${item.slug?.current}`}>
                    {item.title}
                  </Link>{" "}
                  :
                </Text>
                <Text>{item.total}</Text>
                {item.total > 0 && (
                  <Text fontSize="sm">
                    (
                    {item.occurrences.map(({ date, _key, attendances }) => (
                      <Link
                        to={`/${org}/gatherings/${item.slug?.current}/${date}`}
                      >
                        {date}
                      </Link>
                    ))}
                    )
                  </Text>
                )}
              </HStack>
            )}
          />
        </Stack>
      </Text>
    </Layout>
  );
};

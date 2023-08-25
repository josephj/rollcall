import dayjs from "dayjs";
export const getReportStartEndDateTimes = (baseDate = new Date()) => {
  // Start from last Friday 00:00:00
  let startDateTime = dayjs(baseDate).startOf("day");
  while (startDateTime.day() !== 5 /* Friday */) {
    startDateTime = startDateTime.subtract(1, "day");
  }

  // End until future Thursday 23:59:59
  let endDateTime = dayjs(baseDate).endOf("day");
  while (endDateTime.day() !== 4 /* Thursday */) {
    endDateTime = endDateTime.add(1, "day");
  }

  return { startDateTime, endDateTime };
};

export const mapGathering = ({ occurrences, ...rest }) => ({
  total:
    occurrences?.reduce(
      (result, { attendances }) => result + (attendances?.length || 0),
      0,
    ) || 0,
  occurrences:
    occurrences?.filter(({ attendances }) => !!attendances?.length) || [],
  ...rest,
});

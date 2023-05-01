import dayjs from "dayjs";
export const getReportStartEndDateTimes = () => {
  // Start from last Friday 00:00:00
  let startDateTime = dayjs().startOf("day");
  while (startDateTime.day() !== 5 /* Friday */) {
    startDateTime = startDateTime.subtract(1, "day");
  }

  // End until future Thursday 23:59:59
  let endDateTime = dayjs().endOf("day");
  while (endDateTime.day() !== 4 /* Thursday */) {
    endDateTime = endDateTime.add(1, "day");
  }

  return { startDateTime, endDateTime };
};

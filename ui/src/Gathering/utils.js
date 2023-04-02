import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc)

export const getUpcomingDates = ({ rrule }) => {
  const endDate = dayjs.utc().endOf("day");
  const startDate = endDate.subtract(1, "week").startOf("day");
  rrule.options.dtstart = startDate.toDate();
  return rrule
    .between(startDate.toDate(), endDate.toDate(), true)
    .map((date) => dayjs.utc(date).format("YYYY-MM-DD"));
};
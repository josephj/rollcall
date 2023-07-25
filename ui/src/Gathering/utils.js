import dayjs from "dayjs";
import { rrulestr } from "rrule";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getUpcomingDates = ({ rrule }) => {
  const endDate = dayjs.utc().endOf("day");
  const startDate = endDate.subtract(1, "week").startOf("day");
  rrule.options.dtstart = startDate.toDate();
  return rrule
    .between(startDate.toDate(), endDate.toDate(), true)
    .map((date) => dayjs.utc(date).format("YYYY-MM-DD"));
};

export const getNextDate = (rruleString, currentDate) => {
  const rule = rrulestr(rruleString);
  const date = dayjs(currentDate || new Date());
  console.log("=>(utils.js:20) date", date);

  const occurrences = rule.between(
    date.add(1, "day").toDate(),
    dayjs().add(1, "year").toDate()
  );
  console.log("=>(utils.js:26) occurrences", occurrences);
  const nextDate = occurrences.find((occurrence) =>
    dayjs(occurrence).isAfter(date)
  );

  return nextDate ? dayjs(nextDate).format("YYYY-MM-DD") : null;
};

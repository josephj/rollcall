import { useCallback } from "react";

import { sanityClient } from "../sanityClient";
import { occurrenceQuery } from "./query.occurrence";

export const useApi = ({ date, slug }) => {
  const addMember = useCallback(({ memberId, gatheringId }) => {
    sanityClient
      .patch(memberId)
      .append("gatherings", [{ _ref: gatheringId, _type: "reference" }])
      .commit({ autoGenerateArrayKeys: true });
  }, []);

  const createMember = useCallback(
    async ({ name, alias, email, organizationId }) =>
      sanityClient.create({
        _type: "member",
        alias,
        email,
        gatherings: [],
        name,
        organization: { _ref: organizationId, _type: "reference" },
      }),
    []
  );

  const fetchOccurrence = useCallback(
    async () =>
      sanityClient.fetch(occurrenceQuery, {
        date,
        slug,
      }),
    [date, slug]
  );

  const tickAttendance = async ({ gatheringId, occurrenceKey, memberId }) => {
    const attendanceData = {
      _type: "attendance",
      member: {
        _ref: memberId,
        _type: "reference",
      },
    };

    return sanityClient
      .patch(gatheringId)
      .append(`occurrences[_key == "${occurrenceKey}"].attendances`, [
        attendanceData,
      ])
      .commit({ autoGenerateArrayKeys: true });
  };

  const untickAttendance = async ({
    gatheringId,
    occurrenceKey,
    attendanceKey,
  }) =>
    sanityClient
      .patch(gatheringId)
      .unset([
        `occurrences[_key=="${occurrenceKey}"].attendances[_key=="${attendanceKey}"]`,
      ])
      .commit();

  return {
    addMember,
    createMember,
    fetchOccurrence,
    tickAttendance,
    untickAttendance,
  };
};

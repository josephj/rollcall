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

  const updateAttendances = useCallback(
    async ({ gatheringId, occurrenceKey, attendanceMemberIds }) => {
      const attendances = attendanceMemberIds.map((memberId) => ({
        _type: "attendance",
        member: {
          _ref: memberId,
          _type: "reference",
        },
      }));

      return sanityClient
        .patch(gatheringId)
        .set({
          [`occurrences[_key == "${occurrenceKey}"].attendances`]: attendances,
        })
        .commit({ autoGenerateArrayKeys: true });
    },
    []
  );

  const tickAttendance = async ({ gatheringId, occurrenceKey, memberId }) => {
    const { occurrences = [] } = await fetchOccurrence();
    const { attendances = [] } = occurrences[0];
    const isTicked = attendances.some(({ member }) => member._ref === memberId);
    if (isTicked) return;

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
  }) => {
    const { occurrences = [] } = await fetchOccurrence();
    const { attendances = [] } = occurrences[0];
    const isTicked = attendances.some(({ _key }) => _key === attendanceKey);
    if (!isTicked) return;

    return sanityClient
      .patch(gatheringId)
      .unset([
        `occurrences[_key=="${occurrenceKey}"].attendances[_key=="${attendanceKey}"]`,
      ])
      .commit();
  };

  return {
    addMember,
    createMember,
    fetchOccurrence,
    tickAttendance,
    untickAttendance,
    updateAttendances,
  };
};

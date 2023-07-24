import { sanityClient } from "../../sanityClient";

export const removeMemberFromGathering = ({ memberId, gatheringId }) =>
  sanityClient
    .patch(memberId)
    .unset([`gatherings[_ref=="${gatheringId}"]`])
    .commit();

export const addMemberToGathering = ({ memberId, gatheringId }) =>
  sanityClient
    .patch(memberId)
    .append("gatherings", [{ _ref: gatheringId, _type: "reference" }])
    .commit({ autoGenerateArrayKeys: true });

export const setMemberAsGatheringLeader = ({ memberId, gatheringId }) =>
  sanityClient
    .patch(gatheringId)
    .set({ leader: { _ref: memberId, _type: "reference" } })
    .commit();

export const setAttendanceAsOccurrenceHost = ({
  gatheringId,
  occurrenceKey,
  memberId,
}) =>
  sanityClient
    .patch(gatheringId)
    .set({
      [`occurrences[_key=="${occurrenceKey}"].host`]: {
        _ref: memberId,
        _type: "reference",
      },
    })
    .commit({ autoGenerateArrayKeys: true });

export const useApi = ({ memberId, occurrenceKey, gatheringId }) => {
  const setAsMember = () => addMemberToGathering({ memberId, gatheringId });

  const setAsVisitor = () =>
    removeMemberFromGathering({ memberId, gatheringId });

  const setAsHost = () =>
    setAttendanceAsOccurrenceHost({ gatheringId, occurrenceKey, memberId });

  const setAsLeader = () =>
    setMemberAsGatheringLeader({ memberId, gatheringId });

  return {
    setAsHost,
    setAsLeader,
    setAsMember,
    setAsVisitor,
  };
};

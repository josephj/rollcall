import { useCallback } from "react";

import { useQuery } from "../../utils/useQuery";
import { sanityClient } from "../../sanityClient";

const QUERY = [
  `*[_type == "gathering" && slug.current == $slug][0] { _id, occurrences }`,
];

export const useApi = ({ slug }) => {
  const { data: rawData, isLoading } = useQuery(QUERY, { slug });
  const gatheringId = rawData?._id;
  const usedDateStrings = rawData?.occurrences.map?.(({ date }) => date) || [];

  const createOccurrence = useCallback(
    ({ date }) =>
      sanityClient
        .patch(gatheringId)
        .setIfMissing({ occurrences: [] })
        .append("occurrences", [{ date, attendances: [], _type: "occurrence" }])
        .commit({ autoGenerateArrayKeys: true }),
    [gatheringId]
  );

  return {
    usedDateStrings,
    isLoading,
    createOccurrence,
  };
};

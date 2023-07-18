import { useQuery } from "../../utils/useQuery";

const QUERY = [
  `*[_type == "gathering" && slug.current == $slug][0] { occurrences }`,
];

export const useApi = ({ slug }) => {
  const { data: rawData, isLoading } = useQuery(QUERY, { slug });
  const usedDateStrings = rawData?.occurrences.map?.(({ date }) => date) || [];

  return { usedDateStrings, isLoading };
};

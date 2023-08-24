import { gql, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { Stack, Text } from "native-base";
import { t } from "@lingui/macro";

import { Card, Layout } from "./components";

const GET_GATHERING_LIST = gql`
  query {
    allGathering {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`;

export const Gatherings = () => {
  const { org } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery(GET_GATHERING_LIST);
  const gatherings = data?.allGathering || [];

  return (
    <Layout headerContent={t`Gatherings`} isLoading={loading}>
      <Stack space={5}>
        {gatherings.map(({ _id, title, name, slug }) => (
          <Card
            key={_id}
            textAlign="center"
            minWidth="250px"
            onClick={() => navigate(`/${org}/gatherings/${slug.current}`)}
          >
            <Text fontWeight="500">{title}</Text>
            <Text fontSize="11px">{name}</Text>
          </Card>
        ))}
      </Stack>
    </Layout>
  );
};

import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Container, Flex, Stack, Text } from "native-base";

import { Card, Header } from "./components";

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
  const { loading, error, data } = useQuery(GET_GATHERING_LIST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Stack flexDirection="column" height="100%" space={5}>
      <Header marginBottom={10}>
        <Text fontSize="lg" fontWeight="500">
          Gatherings
        </Text>
      </Header>
      <Flex
        alignItems="center"
        flexGrow="1"
        justifyContent="center"
      >
        <Container>
          <Stack space={5}>
            {data.allGathering.map(({ _id, title, name, slug }) => (
              <Link to={slug.current} style={{ textDecoration: "none" }}>
                <Card textAlign="center" minWidth="250px">
                  <Text fontWeight="500">{title}</Text>
                  <Text fontSize="11px">{name}</Text>
                </Card>
              </Link>
            ))}
          </Stack>
        </Container>
      </Flex>
    </Stack>
  );
};

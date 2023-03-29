import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Container, Flex, Stack, Text } from "native-base";

import { Card, Header } from "./components";

const GET_GATHERING_LIST = gql`
  query {
    allOrganization {
      _id
      slug {
        current
      }
      title
      name
    }
  }
`;

export const App = () => {
  const { loading, error, data } = useQuery(GET_GATHERING_LIST);
  const navigate = useNavigate()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleClick = (slug) => {
    navigate(`/organization/${slug}/gatherings`)
  };

  return (
    <Flex flexDirection="column" height="100%">
      <Header>
        <Text fontSize="lg" fontWeight="500">
          Organizations
        </Text>
      </Header>
      <Flex
        alignItems="center"
        justifyContent="center"
        background="coolGray.50"
        flexGrow="1"
      >
        <Container>
          <Stack space={5}>
            {data.allOrganization.map(({ _id, slug, name }) => (
              <Card textAlign="center" minWidth="250px" onClick={() => handleClick(slug.current)}>
                <Text fontWeight="400">{name}</Text>
              </Card>
            ))}
          </Stack>
        </Container>
      </Flex>
    </Flex>
  );
};

export default App;

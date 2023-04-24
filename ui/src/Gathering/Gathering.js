import { useState, useEffect } from "react";
import groq from "groq";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Stack,
  Spinner,
  Text,
} from "native-base";
import { rrulestr } from "rrule";

import { Card, Header } from "../components";
import { sanityClient } from "../sanityClient";
import { getUpcomingDates } from "./utils";

const query = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
    location,
    occurrences[],
    recurrence,
    "members": *[_type == "member" && references(^._id)] | order(name) {
      _id,
      name,
      alias,
    }
  }
`;

export const Gathering = () => {
  const params = useParams();
  const { org, slug } = params;
  const [gathering, setGathering] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGathering = async () => {
      try {
        const gathering = await sanityClient.fetch(query, { slug });
        setGathering(gathering);
      } catch (e) {
        console.error(e.message);
      }
    };
    loadGathering();
  }, [slug]);

  if (!gathering) {
    return (
      <Flex paddingY={10}>
        <HStack alignItems="center" space={2} justifyContent="center">
          <Spinner />
          <Heading color="primary.500" fontSize="md">
            Loading
          </Heading>
        </HStack>
      </Flex>
    );
  }

  const { _id, location, occurrences = [], recurrence, title } = gathering;
  const rrule = rrulestr(recurrence);
  const createdDates = occurrences.map(({ date }) => date);
  const notCreatedDates = getUpcomingDates({ rrule }).filter(
    (date) => !createdDates.includes(date)
  );

  const handleClickCreate = async (date) => {
    await sanityClient
      .patch(_id)
      .setIfMissing({ occurrences: [] })
      .append("occurrences", [{ date, attendances: [], _type: "occurrence" }])
      .commit({ autoGenerateArrayKeys: true });

    navigate(`/${org}/gatherings/${slug}/${date}`);
  };

  return (
    <Stack flexDirection="column" height="100%" space={5}>
      <Header>
        <Text fontSize="lg" fontWeight="500">
          <Link to={`/${org}/gatherings`}>Gatherings</Link> &gt; {title}
        </Text>
      </Header>
      <Flex alignItems="center" justifyContent="flex-start" flexGrow="1">
        <Container>
          <Stack space={5}>
            <Box alignSelf="center" textAlign="center">
              <Text>{location}</Text>
              <Text>{rrule.toText()}</Text>
            </Box>

            {notCreatedDates.length ? (
              <Stack as="section" space="5">
                <Heading size="sm" textAlign="center">
                  Not Established
                </Heading>
                <Stack space="5">
                  {notCreatedDates.map((date) => (
                    <Card
                      key={date}
                      textAlign="center"
                      minWidth="250px"
                      onClick={() => handleClickCreate(date)}
                    >
                      <Text fontWeight="500">{date}</Text>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            ) : null}

            <hr />

            {createdDates.length ? (
              <Stack space="5">
                <Heading size="sm" textAlign="center">
                  Established
                </Heading>
                <Stack space="5">
                  {occurrences.map(({ _key, date, attendances = [] }) => (
                    <Card
                      key={_key}
                      textAlign="center"
                      minWidth="250px"
                      onClick={() =>
                        navigate(`/${org}/gatherings/${slug}/${date}`)
                      }
                    >
                      <Text fontSize="13" fontWeight="500">
                        {date}
                      </Text>
                      <Text fontSize="11">
                        Attendances:{" "}
                        <Text fontWeight="500">{attendances.length}</Text>
                      </Text>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </Container>
      </Flex>
    </Stack>
  );
};

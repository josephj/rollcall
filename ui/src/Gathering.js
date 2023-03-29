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
import dayjs from "dayjs";

import { Card, Header } from "./components";
import { sanityClient } from "./sanityClient";

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
  const endDate = dayjs().endOf("day");
  const startDate = endDate.subtract(1, "week").startOf("day");
  const upcomingDates = rrule
    .between(startDate.toDate(), endDate.toDate(), true)
    .map((date) => dayjs(date).format("YYYY-MM-DD"))
    .filter(
      (date) => !occurrences.find((occurrence) => occurrence.date === date)
    );

  const handleClickCreate = async (date) => {
    await sanityClient.patch(_id).append("occurrences", [{ date }]).commit();
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
          <Box alignSelf="center" textAlign="center">
            <Text>{location}</Text>
            <Text>{rrule.toText()}</Text>
          </Box>
          <Stack space="5">
            {upcomingDates.map((date) => (
              <Card
                key={date}
                height="auto"
                size="md"
                textAlign="center"
                onClick={() => handleClickCreate(date)}
              >
                <Text fontWeight="500">{date}</Text>
              </Card>
            ))}
            <hr />
            {occurrences.map(({ _key, date, attendances = [], ...rest }) => (
              <Link to={date} style={{ textDecoration: "none" }}>
                <Card key={_key} textAlign="center" minWidth="250px">
                  <Text fontSize="13" fontWeight="500">
                    {date}
                  </Text>
                  <Text fontSize="11">
                    Attendances:{" "}
                    <Text fontWeight="500">{attendances.length}</Text>
                  </Text>
                </Card>
              </Link>
            ))}
          </Stack>
        </Container>
      </Flex>
    </Stack>
  );
};

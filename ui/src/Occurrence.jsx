import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import groq from "groq";

import {
  Box,
  Container,
  Checkbox,
  Flex,
  HStack,
  Stack,
  Text,
} from "native-base";

import { Card, Header } from "./components";
import { sanityClient } from "./sanityClient";

const query = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
    location,
    occurrences[date == $date],
    "members": *[_type == "member" && references(^._id)] | order(name) {
      _id,
      name,
      alias,
    }
  }
`;

export const Occurrence = () => {
  const { slug, date, org } = useParams();
  const [gathering, setGathering] = useState();

  useEffect(() => {
    const loadGathering = async () => {
      try {
        const gathering = await sanityClient.fetch(query, { date, slug });
        setGathering(gathering);
      } catch (e) {
        console.error(e.message);
      }
    };
    loadGathering();
  }, [date, slug]);

  if (!gathering) {
    return;
  }

  const {
    _id: gatheringId,
    title,
    occurrences,
    members = [],
  } = gathering || {};

  const [{ attendances = [], _key: occurrenceKey }] = occurrences || [];

  const memberIds = attendances.map(({ member }) => member?._ref);

  const handleCheckMember = async ({ memberId, attendanceKey }) => {
    const isAdding = !memberIds.includes(memberId);

    if (isAdding) {
      const attendanceData = {
        _type: "attendance",
        member: {
          _ref: memberId,
          _type: "reference",
        },
      };

      sanityClient
        .patch(gatheringId)
        .append(`occurrences[_key == "${occurrenceKey}"].attendances`, [
          attendanceData,
        ])
        .commit({ autoGenerateArrayKeys: true });
    } else {
      sanityClient
        .patch(gatheringId)
        .unset([
          `occurrences[_key=="${occurrenceKey}"].attendances[_key=="${attendanceKey}"]`,
        ])
        .commit();
    }
  };

  return (
    <Stack flexDirection="column" height="100%" space={5}>
      <Header>
        <Text fontSize="lg" fontWeight="500">
          <Link to={`/${org}/gatherings/${slug}`}>
            {title} ({slug})
          </Link>{" "}
          &gt; {date}
        </Text>
      </Header>
      <Flex alignItems="center" justifyContent="flex-start" flexGrow="1">
        <Container>
          <Stack space={5}>
            <Box alignSelf="center" textAlign="center">
              <Text>Attendances: {attendances.length}</Text>
            </Box>
            <Stack space={5}>
              {members.map(({ _id: memberId, name, alias }) => (
                <Card
                  key={memberId}
                  textAlign="center"
                  minWidth="250px"
                  onClick={() => {
                    const attendance = attendances.find(
                      ({ member }) => member._ref === memberId
                    );
                    const attendanceKey = attendance?._key;
                    console.log("-> attendanceKey", attendanceKey);

                    handleCheckMember({
                      memberId: memberId,
                      attendanceKey,
                    });
                  }}
                >
                  <Checkbox
                    defaultIsChecked={memberIds.includes(memberId)}
                    value={memberId}
                  >
                    <HStack space="2">
                      <Text fontWeight="500">{name}</Text>
                      <Text size="xsmall">{alias}</Text>
                    </HStack>
                  </Checkbox>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Flex>
    </Stack>
  );
};

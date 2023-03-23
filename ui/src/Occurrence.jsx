import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import groq from "groq";

import {
  Box,
  Center,
  Checkbox,
  Heading,
  HStack,
  Stack,
  Text,
} from "native-base";

import { Card } from "./components";
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
  }, [slug]);

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
  console.log("-> occurrenceKey", occurrenceKey);

  const memberIds = attendances.map(({ member }) => member?._ref);

  const handleCheckMember = async ({ memberId, attendanceKey }) => {
    const isAdding = !memberIds.includes(memberId);
    console.log("-> attendanceKey", attendanceKey);

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
    <Center marginY={5}>
      <Stack alignItems="center" space={2} width="96">
        <Heading size="md">
          <HStack>
            <Box whiteSpace="nowrap">
              <Link to={`/${org}/gatherings/${slug}`}>{title}</Link>
              <Text> &gt; {date}</Text>
            </Box>
            <Text fontSize="12px">
              ( {attendances.length} / {members.length})
            </Text>
          </HStack>
        </Heading>
        <Stack space={5}>
          {members.map(({ _id: memberId, name, alias }) => (
            <Card
              key={memberId}
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
                <HStack space="sm">
                  <span>{name}</span>
                  <Text size="xsmall">{alias}</Text>
                </HStack>
              </Checkbox>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Center>
  );
};

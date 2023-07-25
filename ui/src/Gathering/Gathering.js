import groq from "groq";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  Fab,
  HStack,
  Skeleton,
  Stack,
  Text,
  useDisclose,
} from "native-base";

import { Layout } from "../components";
import { sanityClient } from "../sanityClient";
import { Info } from "./Info";
import { List } from "./List";
import { AddModal } from "./AddModal";

const query = groq`
  *[_type == "gathering" && slug.current == $slug][0] {
    _key,
    _id,
    title,
    leader->{
      name,
      alias,
    },
    location,
    occurrences[] | order(date desc),
    recurrence,
    "members": *[_type == "member" && references(^._id)] | order(name) {
      _id,
      name,
      alias,
    }
  }
`;

export const Gathering = () => {
  const { org, slug } = useParams();
  const [gathering, setGathering] = useState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclose();

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

  const { _id, title } = gathering || {};

  const handleCreate = async (date) => {
    await sanityClient
      .patch(_id)
      .setIfMissing({ occurrences: [] })
      .append("occurrences", [{ date, attendances: [], _type: "occurrence" }])
      .commit({ autoGenerateArrayKeys: true });

    navigate(`/${org}/gatherings/${slug}/${date}`);
  };

  const handleEdit = (date) => {
    navigate(`/${org}/gatherings/${slug}/${date}`);
  };

  const renderHeaderContent = () => {
    if (!title) {
      return (
        <HStack alignItems="center" space="3">
          <Text fontSize="lg" fontWeight="500">
            <Link to={`/${org}/gatherings`}>Gatherings</Link>
          </Text>
          <Text color="gray.300">&gt;</Text>
          <Skeleton w="100" h="5" rounded="sm" my="1" endColor="gray.200" />
        </HStack>
      );
    }

    return (
      <HStack alignItems="center" space="3">
        <Link to={`/${org}/gatherings`}>Gatherings</Link>
        <Text color="gray.300">&gt;</Text>
        <Text>{title}</Text>
      </HStack>
    );
  };

  return (
    <>
      <Layout headerContent={renderHeaderContent()} isLoading={!gathering}>
        <Stack space={5}>
          <Info {...{ gathering }} />
          <List
            onCreate={handleCreate}
            onEdit={handleEdit}
            {...{ gathering }}
          />
        </Stack>
        <Fab
          colorScheme="blue"
          renderInPortal={false}
          onPress={onOpen}
          shadow={2}
          size="sm"
          icon={<AddIcon name="plus" size="sm" />}
        />
      </Layout>
      <AddModal {...{ isOpen, onClose, slug }} />
    </>
  );
};

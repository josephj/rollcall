import { HStack, Text } from "native-base";

type Props = { name: string; alias?: string };

export const NameAlias = ({ name, alias }: Props) => (
  <HStack space="sm">
    <Text>{name}</Text>
    {alias ? <Text>({alias})</Text> : null}
  </HStack>
);

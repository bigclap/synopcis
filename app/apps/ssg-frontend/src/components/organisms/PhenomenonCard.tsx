import React from 'react';
import Link from 'next/link';
import { Card, Table, Text } from '@mantine/core';
import { CardProperty } from '@/types/phenomenon';

type PhenomenonCardProps = {
  properties: CardProperty[];
};

const PhenomenonCard: React.FC<PhenomenonCardProps> = ({ properties }) => {
  const rows = properties.map((prop, index) => (
    <Table.Tr key={index}>
      <Table.Th>
        <Link href={`/concepts/${prop.property.slug}`} passHref>
          <Text component="a">{prop.property.text}</Text>
        </Link>
      </Table.Th>
      <Table.Td>
        <Link href={`/concepts/${prop.value.slug}`} passHref>
          <Text component="a">{prop.value.text}</Text>
        </Link>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text fw={500}>Key Information</Text>
      <Table>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Card>
  );
};

export default PhenomenonCard;

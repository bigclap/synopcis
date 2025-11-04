'use client';

import { useState, useEffect } from 'react';
import { usePhenomena } from '@/hooks/phenomena/usePhenomena';
import { useConcepts } from '@/hooks/concepts/useConcepts';
import PhenomenonCard from '@/components/organisms/PhenomenonCard';
import ConceptCard from '@/components/molecules/ConceptCard';
import Search from '@/components/atoms/Search';
import { SimpleGrid, Title } from '@mantine/core';

export default function PhenomenaDisplay() {
  const { phenomena } = usePhenomena();
  const { concepts } = useConcepts();
  const [filteredPhenomena, setFilteredPhenomena] = useState(phenomena);
  const [filteredConcepts, setFilteredConcepts] = useState(concepts);

  useEffect(() => {
    setFilteredPhenomena(phenomena);
    setFilteredConcepts(concepts);
  }, [phenomena, concepts]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const newFilteredPhenomena = phenomena.filter((p) =>
      p.title.toLowerCase().includes(lowerCaseQuery),
    );
    const newFilteredConcepts = concepts.filter((c) =>
      c.label.toLowerCase().includes(lowerCaseQuery),
    );
    setFilteredPhenomena(newFilteredPhenomena);
    setFilteredConcepts(newFilteredConcepts);
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <Title order={1} my="xl">
        Phenomena
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredPhenomena.map((phenomenon) => (
          <PhenomenonCard
            key={phenomenon.id}
            properties={phenomenon.cardData.properties}
          />
        ))}
      </SimpleGrid>

      <Title order={1} my="xl">
        Concepts
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredConcepts.map((concept) => (
          <ConceptCard key={concept.key} concept={concept} />
        ))}
      </SimpleGrid>
    </div>
  );
}

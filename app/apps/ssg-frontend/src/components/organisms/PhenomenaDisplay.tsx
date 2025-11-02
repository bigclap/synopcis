'use client';

import { useState, useEffect } from 'react';
import { usePhenomena } from '@/hooks/phenomena/usePhenomena';
import { useConcepts } from '@/hooks/concepts/useConcepts';
import PhenomenonCard from '@/components/molecules/PhenomenonCard';
import ConceptCard from '@/components/molecules/ConceptCard';
import Search from '@/components/atoms/Search';

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
      <h1 className="text-4xl font-bold mb-4">Phenomena</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPhenomena.map((phenomenon) => (
          <PhenomenonCard key={phenomenon.id} phenomenon={phenomenon} />
        ))}
      </div>

      <h1 className="text-4xl font-bold my-4">Concepts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map((concept) => (
          <ConceptCard key={concept.key} concept={concept} />
        ))}
      </div>
    </div>
  );
}

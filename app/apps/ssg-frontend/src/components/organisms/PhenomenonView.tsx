import React from 'react';
import BlockView from '@/components/molecules/BlockView';
import { Phenomenon } from '@/app/mock-data';

type PhenomenonViewProps = {
  phenomenon: Phenomenon;
};

const PhenomenonView: React.FC<PhenomenonViewProps> = ({ phenomenon }) => {
  // Sort blocks by the 'sort' key before rendering
  const sortedBlocks = [...phenomenon.blocks].sort((a, b) => a.sort - b.sort);

  return (
    <article>
      <h1>{phenomenon.title}</h1>
      {sortedBlocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </article>
  );
};

export default PhenomenonView;

import React from 'react';
import BlockView from '@/components/molecules/BlockView';
import { RenderablePhenomenon } from '@/types/phenomenon';

type PhenomenonViewProps = {
  phenomenon: RenderablePhenomenon;
};

const PhenomenonView: React.FC<PhenomenonViewProps> = ({ phenomenon }) => {
  return (
    <article>
      {phenomenon.blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </article>
  );
};

export default PhenomenonView;

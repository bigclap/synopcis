import React from 'react';
import SourceLink from '@/components/atoms/SourceLink';
import AlternativesIndicator from '@/components/atoms/AlternativesIndicator';
import { Block } from '@/app/mock-data'; // Import the type from mock-data

type BlockViewProps = {
  block: Block;
};

const BlockView: React.FC<BlockViewProps> = ({ block }) => {
  const renderContent = () => {
    if (block.type === 'heading' && block.level) {
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return <Tag>{block.content}</Tag>;
    }
    return <p>{block.content}</p>;
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
      {renderContent()}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
        {block.sourceUrl && <SourceLink url={block.sourceUrl} />}
        {block.alternativesCount && block.alternativesCount > 0 && (
          <AlternativesIndicator count={block.alternativesCount} />
        )}
      </div>
    </div>
  );
};

export default BlockView;

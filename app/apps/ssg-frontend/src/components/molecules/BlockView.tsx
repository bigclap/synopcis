import React from 'react';
import SourceLink from '@/components/atoms/SourceLink';
import AlternativesIndicator from '@/components/atoms/AlternativesIndicator';
import { RenderableBlock } from '@/types/phenomenon';
import ReactMarkdown from 'react-markdown';

type BlockViewProps = {
  block: RenderableBlock;
};

const BlockView: React.FC<BlockViewProps> = ({ block }) => {
  const renderContent = () => {
    // react-markdown will handle headings, paragraphs, quotes, etc.
    return <ReactMarkdown>{block.content}</ReactMarkdown>;
  };

  return (
    <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
      {renderContent()}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
        {block.source?.type === 'web' && block.source.url && (
          <SourceLink url={block.source.url} />
        )}
        {/* You might want a different component for offline sources */}
        {block.source?.type === 'offline' && block.source.identifier && (
          <span>Source: {block.source.identifier}</span>
        )}

        {block.alternativesCount > 1 && ( // Show indicator if there are alternatives
          <AlternativesIndicator count={block.alternativesCount} />
        )}
      </div>
    </div>
  );
};

export default BlockView;

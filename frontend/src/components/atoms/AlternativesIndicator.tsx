import React from 'react';

type AlternativesIndicatorProps = {
  count: number;
};

const AlternativesIndicator: React.FC<AlternativesIndicatorProps> = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <span style={{ marginLeft: '8px', cursor: 'pointer', color: 'blue' }}>
      [+{count}]
    </span>
  );
};

export default AlternativesIndicator;

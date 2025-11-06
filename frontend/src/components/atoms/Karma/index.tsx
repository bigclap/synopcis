import React from 'react';

interface KarmaProps {
  value: number;
}

const Karma: React.FC<KarmaProps> = ({ value }) => {
  return (
    <div>
      <h2>Karma</h2>
      <p>{value}</p>
    </div>
  );
};

export default Karma;

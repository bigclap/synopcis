import React from 'react';

interface ActivityProps {
  type: string;
  timestamp: string;
  details: string;
}

const Activity: React.FC<ActivityProps> = ({ type, timestamp, details }) => {
  return (
    <div>
      <p>
        <strong>{type}</strong> - {new Date(timestamp).toLocaleString()}
      </p>
      <p>{details}</p>
    </div>
  );
};

export default Activity;

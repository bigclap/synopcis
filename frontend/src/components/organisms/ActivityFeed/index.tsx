import React from 'react';
import Activity from '@/components/molecules/Activity';

interface ActivityFeedProps {
  activities: {
    id: string;
    type: string;
    timestamp: string;
    details: string;
  }[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div>
      <h2>Activity Feed</h2>
      {activities.map((activity) => (
        <Activity
          key={activity.id}
          type={activity.type}
          timestamp={activity.timestamp}
          details={activity.details}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;

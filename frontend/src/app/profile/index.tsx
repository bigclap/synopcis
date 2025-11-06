import React from 'react';
import AchievementsGallery from '@/components/organisms/AchievementsGallery';
import Karma from '@/components/atoms/Karma';
import ActivityFeed from '@/components/organisms/ActivityFeed';
import { achievements } from '@/services/mock-data/achievements';
import { karma, activityFeed } from '@/services/mock-data/profile';
import { GetStaticProps } from 'next';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Activity {
  id: string;
  type: string;
  timestamp: string;
  details: string;
}

interface UserProfilePageProps {
  achievements: Achievement[];
  karma: {
    value: number;
  };
  activityFeed: Activity[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ achievements, karma, activityFeed }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <Karma value={karma.value} />
      <AchievementsGallery achievements={achievements} />
      <ActivityFeed activities={activityFeed} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      achievements,
      karma,
      activityFeed,
    },
  };
};

export default UserProfilePage;

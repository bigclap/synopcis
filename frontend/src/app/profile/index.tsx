import React from 'react';
import AchievementsGallery from '@/components/profile/organisms/AchievementsGallery';
import Karma from '@/components/profile/atoms/Karma';
import ActivityFeed from '@/components/profile/organisms/ActivityFeed';
import { achievements } from '@/components/profile/services/achievementsService';
import { karma, activityFeed } from '@/components/profile/services/profileService';
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

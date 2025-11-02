import React from 'react';
import AchievementsGallery from '@/components/organisms/AchievementsGallery';
import { achievements } from '@/services/mock-data/achievements';
import { GetStaticProps } from 'next';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface UserProfilePageProps {
  achievements: Achievement[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ achievements }) => {
  return (
    <div>
      <h1>User Profile</h1>
      <AchievementsGallery achievements={achievements} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      achievements,
    },
  };
};

export default UserProfilePage;

import React from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementsGalleryProps {
  achievements: Achievement[];
}

const AchievementsGallery: React.FC<AchievementsGalleryProps> = ({ achievements }) => {
  return (
    <div>
      <h2>Achievements</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {achievements.map((achievement) => (
          <div key={achievement.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>{achievement.icon}</span>
            <h3>{achievement.name}</h3>
            <p>{achievement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsGallery;

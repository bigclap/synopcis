import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfilePage from '../../app/profile';
import { achievements } from '@/services/mock-data/achievements';
import { karma, activityFeed } from '@/services/mock-data/profile';

describe('UserProfilePage', () => {
  it('renders karma, achievements, and activity feed', () => {
    render(
      <UserProfilePage
        achievements={achievements}
        karma={karma}
        activityFeed={activityFeed}
      />
    );

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Karma')).toBeInTheDocument();
    expect(screen.getByText(karma.value.toString())).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('First Steps')).toBeInTheDocument();
    expect(screen.getByText('Activity Feed')).toBeInTheDocument();
    expect(
      screen.getByText('Answered a question about the history of computing.')
    ).toBeInTheDocument();
  });
});

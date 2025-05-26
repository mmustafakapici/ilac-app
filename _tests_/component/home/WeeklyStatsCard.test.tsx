import React from 'react';
import { render } from '@testing-library/react-native';
import WeeklyStatsCard from '@/components/home/WeeklyStatsCard';

describe('WeeklyStatsCard', () => {
  it('haftalık istatistikleri doğru gösterir', () => {
    const stats = [{ total: 10, taken: 7, missed: 2 }];
    const { getByText } = render(
      <WeeklyStatsCard stats={stats} />
    );
    expect(getByText('10')).toBeTruthy();
    expect(getByText('7')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });
}); 
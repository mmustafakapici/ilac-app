import React from 'react';
import { render } from '@testing-library/react-native';
import DailyProgressCard from '@/components/home/DailyProgressCard';

describe('DailyProgressCard', () => {
  it('progress değerlerini doğru gösterir', () => {
    const { getByText } = render(
      <DailyProgressCard total={5} taken={3} missed={1} upcoming={1} />
    );
    expect(getByText('5')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });
}); 
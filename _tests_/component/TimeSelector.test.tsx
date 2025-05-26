import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimeSelector from '@/components/TimeSelector';

describe('TimeSelector', () => {
  const defaultProps = {
    times: ['08:00', '14:00'],
    selectedFrequency: { id: 'daily', label: 'Günlük' },
    onTimeSelect: jest.fn(),
    onTimeAdd: jest.fn(),
    onTimeRemove: jest.fn(),
    onDefaultTimeSelect: jest.fn(),
    onShowTimePicker: jest.fn(),
  };

  it('zamanları doğru render eder', () => {
    const { getByText } = render(<TimeSelector {...defaultProps} />);
    expect(getByText('Sabah (08:00)')).toBeTruthy();
    expect(getByText('Öğle (14:00)')).toBeTruthy();
  });

  it('saat ekle butonuna tıklanabilir', () => {
    const { getByText } = render(<TimeSelector {...defaultProps} />);
    fireEvent.press(getByText('Özel Saat Ekle'));
    expect(defaultProps.onTimeAdd).toHaveBeenCalled();
  });

  it('saat sil butonuna tıklanabilir', () => {
    const { getAllByA11yRole } = render(<TimeSelector {...defaultProps} />);
    // Sil ikonları için erişilebilirlik rolü "button" kullanılıyor
    const buttons = getAllByA11yRole('button');
    // İlk sil butonuna tıkla
    fireEvent.press(buttons[1]);
    expect(defaultProps.onTimeRemove).toHaveBeenCalled();
  });
}); 
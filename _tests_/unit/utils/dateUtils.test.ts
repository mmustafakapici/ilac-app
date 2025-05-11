import { parseISODate, parseTime, addDays, isSameDay, getDateRange, combineDateAndTimeLocal, getDeviceTimezone, convertTimeToDeviceTimezone } from '../../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('parseISODate', () => {
    it('should parse ISO date string correctly', () => {
      const date = parseISODate('2024-03-15');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(2); // 0-based month
      expect(date.getDate()).toBe(15);
    });
  });

  describe('parseTime', () => {
    it('should parse time string correctly', () => {
      const time = parseTime('14:30');
      expect(time.hour).toBe(14);
      expect(time.minute).toBe(30);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2024-03-15');
      const newDate = addDays(date, 5);
      expect(newDate.getDate()).toBe(20);
    });

    it('should handle month boundaries', () => {
      const date = new Date('2024-03-30');
      const newDate = addDays(date, 2);
      expect(newDate.getMonth()).toBe(3); // April
      expect(newDate.getDate()).toBe(1);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2024-03-15T10:00:00');
      const date2 = new Date('2024-03-15T15:30:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-03-15');
      const date2 = new Date('2024-03-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('getDateRange', () => {
    it('should return array of dates between start and end', () => {
      const dates = getDateRange('2024-03-15', '2024-03-17');
      expect(dates).toHaveLength(3);
      expect(dates[0]).toBe('2024-03-15');
      expect(dates[1]).toBe('2024-03-16');
      expect(dates[2]).toBe('2024-03-17');
    });

    it('should return single date for same start and end', () => {
      const dates = getDateRange('2024-03-15', '2024-03-15');
      expect(dates).toHaveLength(1);
      expect(dates[0]).toBe('2024-03-15');
    });
  });

  describe('combineDateAndTimeLocal', () => {
    it('should combine date and time correctly', () => {
      const date = combineDateAndTimeLocal('2024-03-15', '14:30');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(2); // March
      expect(date.getDate()).toBe(15);
      expect(date.getHours()).toBe(14);
      expect(date.getMinutes()).toBe(30);
    });
  });

  describe('getDeviceTimezone', () => {
    it('should return a valid timezone string', () => {
      const timezone = getDeviceTimezone();
      expect(typeof timezone).toBe('string');
      expect(timezone.length).toBeGreaterThan(0);
    });
  });

  describe('convertTimeToDeviceTimezone', () => {
    it('should convert time to device timezone', () => {
      const time = convertTimeToDeviceTimezone('14:30');
      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });
  });
}); 
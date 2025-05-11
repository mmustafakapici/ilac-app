import { groupByDate } from '../../../src/utils/arrayUtils';

describe('arrayUtils', () => {
  describe('groupByDate', () => {
    it('should group items by date correctly', () => {
      const items = [
        { scheduledTime: '2024-03-15T10:00:00', id: 1 },
        { scheduledTime: '2024-03-15T14:00:00', id: 2 },
        { scheduledTime: '2024-03-16T09:00:00', id: 3 },
      ];

      const result = groupByDate(items);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['2024-03-15']).toHaveLength(2);
      expect(result['2024-03-16']).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const items: { scheduledTime: string }[] = [];
      const result = groupByDate(items);
      expect(result).toEqual({});
    });

    it('should handle single item', () => {
      const items = [{ scheduledTime: '2024-03-15T10:00:00', id: 1 }];
      const result = groupByDate(items);
      expect(result['2024-03-15']).toHaveLength(1);
    });
  });
}); 
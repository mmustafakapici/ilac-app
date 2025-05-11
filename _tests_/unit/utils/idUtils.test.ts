import { generateId } from '../../../src/utils/idUtils';

describe('idUtils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs in correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    });

    it('should generate IDs with timestamp and random parts', () => {
      const id = generateId();
      const [timestamp, random] = id.split('-');
      expect(timestamp.length).toBeGreaterThan(0);
      expect(random.length).toBeGreaterThan(0);
    });
  });
}); 
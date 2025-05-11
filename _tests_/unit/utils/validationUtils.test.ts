import { isRequired, isValidTimeFormat } from '../../../src/utils/validationUtils';

describe('Validation Utils', () => {
  describe('isRequired', () => {
    it('should validate non-empty values', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired('0')).toBe(true);
      expect(isRequired('false')).toBe(true);
    });

    it('should reject empty values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });
  });

  describe('isValidTimeFormat', () => {
    it('should validate correct time formats', () => {
      expect(isValidTimeFormat('00:00')).toBe(true);
      expect(isValidTimeFormat('23:59')).toBe(true);
      expect(isValidTimeFormat('12:30')).toBe(true);
    });

    it('should reject invalid time formats', () => {
      expect(isValidTimeFormat('24:00')).toBe(false);
      expect(isValidTimeFormat('00:60')).toBe(false);
      expect(isValidTimeFormat('1:30')).toBe(false);
      expect(isValidTimeFormat('12:3')).toBe(false);
      expect(isValidTimeFormat('abc')).toBe(false);
      expect(isValidTimeFormat('')).toBe(false);
    });
  });
}); 

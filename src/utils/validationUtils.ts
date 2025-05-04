// src/utils/validationUtils.ts

/**
 * Değerin boş olup olmadığını kontrol eder.
 */
export function isRequired(value: any): boolean {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }
  
  /**
   * "HH:MM" formatında geçerli bir zaman mı diye kontrol eder.
   */
  export function isValidTimeFormat(time: string): boolean {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;
    const [h, m] = time.split(':').map(Number);
    return h >= 0 && h < 24 && m >= 0 && m < 60;
  }
  
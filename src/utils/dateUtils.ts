// src/utils/dateUtils.ts

/**
 * "YYYY-MM-DD" formatındaki bir string'i Date nesnesine çevirir.
 */
export function parseISODate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  
  /**
   * Saat:dakika formatındaki bir string'i { hour, minute } objesine çevirir.
   */
  export function parseTime(timeStr: string): { hour: number; minute: number } {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
  }
  
  /**
   * Tarihe gün ekler.
   */
  export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  
  /**
   * İki Date'in aynı gün olup olmadığını kontrol eder.
   */
  export function isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
  
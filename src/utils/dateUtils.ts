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
  
  /**
   * İki tarih aralığını gün gün diziye çevirir (YYYY-MM-DD formatında döner)
   */
  export function getDateRange(start: string, end: string): string[] {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }
  
  /**
   * Tarih ve saati yerel olarak birleştirip Date nesnesi döner
   */
  export function combineDateAndTimeLocal(date: string, time: string): Date {
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
  }
  
  /**
   * Cihazın timezone bilgisini döndürür
   */
  export function getDeviceTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  
  /**
   * Saati cihazın timezone'ına göre dönüştürür
   */
  export function convertTimeToDeviceTimezone(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
  
    // Cihazın timezone'unda saat bilgisini al
    const deviceTime = date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: getDeviceTimezone(),
    });
  
    return deviceTime;
  }
  
// utils/arrayUtils.ts

/**
 * scheduledTime özelliğine göre Reminder dizisini tarih bazında grupla.
 */
export function groupByDate<T extends { scheduledTime: string }>(
    items: T[]
  ): Record<string, T[]> {
    return items.reduce((acc, item) => {
      const dateKey = item.scheduledTime.split('T')[0];
      (acc[dateKey] = acc[dateKey] || []).push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }
  
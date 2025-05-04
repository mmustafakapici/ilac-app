// src/utils/notificationUtils.ts
import * as Notifications from 'expo-notifications';
import { parseTime } from './dateUtils';

/**
 * Belirtilen zaman için günlük tekrarlı notification planlar.
 * @returns notificationId
 */
export async function scheduleDailyNotification(
  timeStr: string,
  title: string,
  body: string
): Promise<string> {
  const { hour, minute } = parseTime(timeStr);
  return await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { hour, minute, repeats: true },
  });
}

/** Tek bir notification'ı iptal eder. */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

/** Tüm planlanmış notification'ları temizler. */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

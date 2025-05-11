// src/utils/notificationUtils.ts
import * as Notifications from 'expo-notifications';

/**
 * Belirtilen zaman için günlük tekrarlı notification planlar.
 * @returns notificationId
 */

/** Tek bir notification'ı iptal eder. */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

/** Tüm planlanmış notification'ları temizler. */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

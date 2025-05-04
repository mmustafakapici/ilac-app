import * as Notifications from 'expo-notifications';
import { getAllMedicines, getUser } from './dataService';
import { parseTime } from '@/utils/dateUtils';

/**
 * Calculate trigger hour/minute by subtracting offset minutes.
 */
function calculateTrigger(timeStr: string, offset: number): { hour: number; minute: number } {
  const { hour, minute } = parseTime(timeStr);
  let total = hour * 60 + minute - offset;
  total = (total + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Schedule notifications for all medicines based on user preferences.
 */
export async function scheduleAllNotifications(): Promise<void> {
  // clear previous schedules
  await Notifications.cancelAllScheduledNotificationsAsync();

  const user = await getUser();
  const meds = await getAllMedicines();
  const offset = user.notificationPreferences.reminderTime;

  for (const med of meds) {
    for (const timeStr of med.schedule.reminders) {
      const { hour, minute } = calculateTrigger(timeStr, offset);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${med.name} hatırlatması`,
          body: `Şimdi ${med.dosage.amount}${med.dosage.unit} ${med.name} almayı unutma.`,
          sound: user.notificationPreferences.sound ? 'default' : undefined,
          priority: Notifications.AndroidNotificationPriority.MAX,
          // For vibration on iOS/Android
        },
        trigger: { hour, minute, repeats: true },
      });
    }
  }
}

/**
 * Reschedule notifications (e.g., after changing preferences or medications).
 */
export async function refreshSchedules(): Promise<void> {
  await scheduleAllNotifications();
}

/**
 * Cancel all scheduled medication notifications.
 */
export async function cancelAllSchedules(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

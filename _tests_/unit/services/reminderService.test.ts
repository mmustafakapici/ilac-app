import * as Notifications from 'expo-notifications';
import { getAllReminders, getUser } from '../../../src/services/dataService';
import { saveNotificationId, getNotificationId, removeNotificationId } from '../../../src/services/notificationStore';
import { scheduleRemindersFromDatabase, cancelAllSchedules, triggerManualNotification } from '../../../src/services/reminderService';
import { ReminderStatus } from '../../../src/models/reminder';

// Mock dependencies
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
}));

jest.mock('../../../src/services/dataService');
jest.mock('../../../src/services/notificationStore');

describe('reminderService', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-03-19T12:00:00Z'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('scheduleRemindersFromDatabase', () => {
    const mockUser = {
      notificationPreferences: {
        reminderTime: 15,
        sound: true
      }
    };

    const mockReminders = [
      {
        id: '1',
        title: 'Test Reminder 1',
        description: 'Test Description 1',
        date: '2024-03-20',
        time: '14:30',
        isTaken: false,
        status: ReminderStatus.PENDING
      },
      {
        id: '2',
        title: 'Test Reminder 2',
        description: 'Test Description 2',
        date: '2024-03-19',
        time: '09:00',
        isTaken: true,
        status: ReminderStatus.PENDING
      }
    ];

    beforeEach(() => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      (getUser as jest.Mock).mockResolvedValue(mockUser);
      (getAllReminders as jest.Mock).mockResolvedValue(mockReminders);
      (getNotificationId as jest.Mock).mockResolvedValue(null);
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('mock-notification-id');
    });

    it('should schedule notifications for valid reminders', async () => {
      await scheduleRemindersFromDatabase();

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
      expect(saveNotificationId).toHaveBeenCalledWith('1', 'mock-notification-id');
    });

    it('should handle notification permission denial', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

      await scheduleRemindersFromDatabase();

      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('should cancel existing notifications before scheduling new ones', async () => {
      (getNotificationId as jest.Mock).mockResolvedValue('existing-notification-id');

      await scheduleRemindersFromDatabase();

      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('existing-notification-id');
      expect(removeNotificationId).toHaveBeenCalledWith('1');
    });
  });

  describe('cancelAllSchedules', () => {
    it('should cancel all scheduled notifications', async () => {
      await cancelAllSchedules();

      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('triggerManualNotification', () => {
    const mockReminder = {
      id: '1',
      title: 'Test Reminder',
      description: 'Test Description',
      date: '2024-03-20',
      time: '14:30'
    };

    beforeEach(() => {
      (getAllReminders as jest.Mock).mockResolvedValue([mockReminder]);
      (getUser as jest.Mock).mockResolvedValue({
        notificationPreferences: { sound: true }
      });
    });

    it('should schedule a manual notification', async () => {
      await triggerManualNotification('1');

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: mockReminder.title,
          body: mockReminder.description,
          sound: 'default',
          data: { reminderId: mockReminder.id }
        },
        trigger: {
          seconds: 5,
          repeats: false
        }
      });
    });

    it('should handle non-existent reminder', async () => {
      await triggerManualNotification('non-existent-id');

      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });
}); 
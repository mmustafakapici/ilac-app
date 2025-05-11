import * as Notifications from 'expo-notifications';
import { cancelNotification, cancelAllNotifications } from '../../../src/utils/notificationUtils';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
}));

describe('Notification Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cancelNotification', () => {
    it('should cancel a specific notification', async () => {
      const notificationId = 'test-notification-id';
      await cancelNotification(notificationId);
      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(notificationId);
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all notifications', async () => {
      await cancelAllNotifications();
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });
}); 
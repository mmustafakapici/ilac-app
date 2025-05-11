import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getNotificationStore,
  saveNotificationId,
  getNotificationId,
  removeNotificationId,
  clearNotificationStore
} from '../../../src/services/notificationStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

describe('notificationStore', () => {
  const mockStore = {
    'reminder-1': 'notification-1',
    'reminder-2': 'notification-2'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockStore));
  });

  describe('getNotificationStore', () => {
    it('should return empty object when store is empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getNotificationStore();
      expect(result).toEqual({});
    });

    it('should return parsed store data', async () => {
      const result = await getNotificationStore();
      expect(result).toEqual(mockStore);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('NOTIFICATION_STORE');
    });
  });

  describe('saveNotificationId', () => {
    it('should save notification id for reminder', async () => {
      await saveNotificationId('reminder-3', 'notification-3');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'NOTIFICATION_STORE',
        JSON.stringify({
          ...mockStore,
          'reminder-3': 'notification-3'
        })
      );
    });

    it('should update existing notification id', async () => {
      await saveNotificationId('reminder-1', 'new-notification-1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'NOTIFICATION_STORE',
        JSON.stringify({
          ...mockStore,
          'reminder-1': 'new-notification-1'
        })
      );
    });
  });

  describe('getNotificationId', () => {
    it('should return notification id for existing reminder', async () => {
      const result = await getNotificationId('reminder-1');
      expect(result).toBe('notification-1');
    });

    it('should return null for non-existent reminder', async () => {
      const result = await getNotificationId('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('removeNotificationId', () => {
    it('should remove notification id for reminder', async () => {
      await removeNotificationId('reminder-1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'NOTIFICATION_STORE',
        JSON.stringify({
          'reminder-2': 'notification-2'
        })
      );
    });

    it('should not affect other reminders when removing one', async () => {
      await removeNotificationId('reminder-1');
      const result = await getNotificationId('reminder-2');
      expect(result).toBe('notification-2');
    });
  });

  describe('clearNotificationStore', () => {
    it('should clear entire notification store', async () => {
      await clearNotificationStore();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('NOTIFICATION_STORE');
    });
  });
}); 
// constants/user.ts


import { User } from '@/models/user';

export const DEFAULT_REMINDER_TIMES = [1, 3, 5, 10]; // minutes

export const SAMPLE_USER: User = {
  id: '1',
  firstName: 'İsim',
  lastName: 'Soyisim',
  age: 35,
  email: 'user@email.com',
  phone: '555-555-55-55',
  notificationPreferences: {
    sound: true,
    vibration: true,
    reminderTime: 5,
  },
};
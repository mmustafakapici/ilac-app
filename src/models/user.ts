// src/models/user.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone?: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  sound: boolean;
  vibration: boolean;
  reminderTime: number; // minutes before medication time
}
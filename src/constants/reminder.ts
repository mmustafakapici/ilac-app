// src/constants/reminder.ts


import { ReminderStatus } from '@/models/reminder';

// Hatırlatıcı durumlarına göre renkler
export const REMINDER_STATUS_COLORS = {
  [ReminderStatus.PENDING]: '#FFB020', // Turuncu
  [ReminderStatus.TAKEN]: '#14B8A6',   // Yeşil
  [ReminderStatus.MISSED]: '#D14343',  // Kırmızı
  [ReminderStatus.SKIPPED]: '#94A3B8', // Gri
};

// Hatırlatıcı durumlarının Türkçe karşılıkları
export const REMINDER_STATUS_LABELS = {
  [ReminderStatus.PENDING]: 'Beklemede',
  [ReminderStatus.TAKEN]: 'Alındı',
  [ReminderStatus.MISSED]: 'Kaçırıldı',
  [ReminderStatus.SKIPPED]: 'Atlandı',
};

// Varsayılan hatırlatma süreleri (dakika cinsinden)
export const DEFAULT_REMINDER_INTERVALS = {
  BEFORE_15: 15,    // 15 dakika önce
  BEFORE_30: 30,    // 30 dakika önce
  BEFORE_60: 60,    // 1 saat önce
  CUSTOM: -1,       // Özel süre
};

// Hatırlatıcı tipleri
export const REMINDER_TYPES = {
  NOTIFICATION: 'notification',  // Bildirim
  ALARM: 'alarm',               // Alarm
  SMS: 'sms',                   // SMS
  EMAIL: 'email',               // E-posta
} as const;
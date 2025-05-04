// models/reminder.ts

import { Medicine } from './medicine';

export interface Reminder {
  id: string;             // Reminder'ın eşsiz kimliği
  medicine: Medicine;     // İlgili ilacın tüm detayları
  medicineId: string;
  date: string;          // Hatırlatma tarihi, "YYYY-MM-DD" formatında
  time: string;
  title: string;
  description: string;
  isTaken?: boolean;       // İlaç alındı mı?
  scheduledTime?: string;  // Hatırlatma saati, "HH:MM" formatında
  createdAt?: string;     // Oluşturulma zamanı
  updatedAt?: string;     // Son güncelleme zamanı
}

// Reminder durumları için enum
export enum ReminderStatus {
  PENDING = 'pending',    // Beklemede
  TAKEN = 'taken',       // Alındı
  MISSED = 'missed',     // Kaçırıldı
  SKIPPED = 'skipped',   // Atlandı
}

// Reminder oluşturmak için yardımcı fonksiyon
export function createReminder(
  medicine: Medicine,
  scheduledTime: string,
  date: string
): Omit<Reminder, 'id'> {
  return {
    medicine,
    scheduledTime,
    date,
    isTaken: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
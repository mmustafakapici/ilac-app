// src/models/medicine.ts
export interface Medicine {
  id: string;
  name: string;
  dosage?: {
    amount: number;
    unit: string;
  };
  type?: string;
  class?: string;
  usage?: {
    frequency: string;
    time: string[];
    condition: string;
  };
  schedule?: {
    startDate: string;
    endDate: string | null;
    reminders: string[];
  };
  notes?: string;
  image?: string;
}
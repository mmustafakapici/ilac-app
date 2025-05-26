// src/constants/medicine.ts

import { Medicine } from '@/models/medicine';

export const MEDICINE_TYPES = ['Tablet', 'Kapsül', 'Şurup', 'Sprey', 'Damla', 'İğne', 'Merhem', 'Gargara'];

export const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Günlük', subOptions: ['1x1', '2x1', '3x1', '4x1'] },
  { id: 'weekly', label: 'Haftalık', subOptions: ['Haftada 1', 'Haftada 2', 'Haftada 3'] },
  { id: 'monthly', label: 'Aylık', subOptions: ['Ayda 1', 'Ayda 2'] },
  { id: 'asNeeded', label: 'Gerektiğinde' },
];

export const TIME_PRESETS = {
  '1x1': ['08:00'],
  '2x1': ['08:00', '20:00'],
  '3x1': ['08:00', '14:00', '20:00'],
  '4x1': ['08:00', '14:00', '20:00', '23:59'],
};

export const DEFAULT_TIMES = {
  morning: '08:00',
  noon: '14:00',
  evening: '20:00',
  night: '23:59',
} as const;

export const UNIT_OPTIONS = ['mg', 'ml', 'g', 'IU'];

export const CONDITION_OPTIONS = [
  'Aç karnına',
  'Tok karnına',
  'Yemeklerden önce',
  'Yemeklerden sonra',
  'Fark etmez',
];


export const MEDICINE_CLASS = [
    'Antibiyotik',
    'Ağrı kesici',
    'Ateş düşürücü',
    'Kas Gevşetici',
    'Mide',
    'Kalp',
    
    'Astım',
    'Alerjik',
    'Cilt',
    'Sindirim',
    'Gargara',
    'Bulantı',
    'öksürük',
    'Boşaltım',
    'Diğer',
]
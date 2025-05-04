// src/services/TextParserService.ts
import { Medicine } from '@/models/medicine';

interface RawMedicineData {
  name?: string;
  dosage?: { amount?: number | string; unit?: string };
  type?: string;
  usage?: { frequency?: string; time?: string[]; condition?: string };
  schedule?: { startDate?: string; endDate?: string | null; reminders?: string[] };
  notes?: string;
}

export class TextParserService {
  private static normalizeAmount(amount?: number | string): number {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      const num = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  private static normalizeUnit(unit?: string): string {
    const u = unit?.toLowerCase() || 'mg';
    return ['mg', 'ml', 'mcg', 'g', 'iu'].includes(u) ? u : 'mg';
  }

  private static normalizeType(type?: string): string {
    if (!type) return 'Tablet';
    const t = type.trim().toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  private static normalizeFrequency(freq?: string): string {
    return freq?.toUpperCase() || 'GÜNLÜK';
  }

  private static normalizeTime(times?: string[]): string[] {
    return Array.isArray(times) && times.length > 0 ? times : ['08:00'];
  }

  private static normalizeCondition(cond?: string): string {
    return cond || '';
  }

  private static normalizeDate(date?: string): string {
    if (!date) return new Date().toISOString().split('T')[0];
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static extractJsonString(input: string): string {
    // JSON objesini bulmak için regex kullan
    const jsonMatch = input.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON formatı bulunamadı');
    }
    
    // Bulunan JSON string'ini döndür
    return jsonMatch[0];
  }

  public static parseText(input: string): Medicine {
    try {
      console.log('TextParser Ham Input:', input);
      
      // JSON string'ini çıkar
      const jsonString = this.extractJsonString(input);
      console.log('TextParser Çıkarılan JSON:', jsonString);
      
      // JSON parse et
      const raw: RawMedicineData = JSON.parse(jsonString);

      const medicine: Medicine = {
        id: this.generateId(),
        name: raw.name || 'Bilinmeyen İlaç',
        dosage: {
          amount: this.normalizeAmount(raw.dosage?.amount),
          unit: this.normalizeUnit(raw.dosage?.unit)
        },
        type: this.normalizeType(raw.type),
        usage: {
          frequency: this.normalizeFrequency(raw.usage?.frequency),
          time: this.normalizeTime(raw.usage?.time),
          condition: this.normalizeCondition(raw.usage?.condition)
        },
        schedule: {
          startDate: this.normalizeDate(raw.schedule?.startDate),
          endDate: raw.schedule?.endDate ? this.normalizeDate(raw.schedule.endDate) : null,
          reminders: Array.isArray(raw.schedule?.reminders)
            ? raw.schedule!.reminders!
            : this.normalizeTime(raw.usage?.time)
        },
        notes: raw.notes,
        image: undefined
      };

      console.log('TextParser Oluşturulan Medicine:', medicine);
      return medicine;

    } catch (error) {
      console.error('TextParserService Hatası:', error);
      throw new Error('Metin parse edilemedi');
    }
  }
}

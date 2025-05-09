// src/services/DeepSeekService.ts
import { OPENROUTER_API_KEY } from '@env';
import {
  MEDICINE_TYPES,
  MEDICINE_CLASS,
  UNIT_OPTIONS,
  CONDITION_OPTIONS,
  FREQUENCY_OPTIONS,
  TIME_PRESETS,
  DEFAULT_TIMES
} from '@/constants/medicine';

export class DeepSeekService {
  private static readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  public static async processText(text: string): Promise<string> {
    // Hazır sabitleri string haline getir
    const validTypes   = MEDICINE_TYPES.join(', ');
    const validUnits   = UNIT_OPTIONS.join(', ');
    const validConds   = CONDITION_OPTIONS.join(', ');
    const validFreqIds = FREQUENCY_OPTIONS.map(o => o.id).join(', ');
    const validClasses = MEDICINE_CLASS.join(', '); 
    // Saat presetlerini string haline getir
    const timePresets = Object.entries(TIME_PRESETS)
      .map(([key, times]) => `${key}: [${times.join(', ')}]`)
      .join('\n');
    
    const defaultTimes = Object.entries(DEFAULT_TIMES)
      .map(([key, time]) => `${key}: ${time}`)
      .join('\n');

    const prompt = `Aşağıdaki metinden ilaç bilgilerini çıkar ve JSON formatında döndür.

- Geçerli türler: [${validTypes}]
- Geçerli sınıflar: [${validClasses}]
- Geçerli birimler: [${validUnits}]
- Geçerli koşullar: [${validConds}]
- Geçerli frekans kimlikleri: [${validFreqIds}]
- Geçerli saat presetleri:
${timePresets}
- Varsayılan saatler:
${defaultTimes}

JSON şablonu:
{
  "name": "string",
  "dosage": { "amount": number, "unit": "string" },
  "type": "string",
  "class": "string",
  "usage": { "frequency": "string", "time": ["string"], "condition": "string" },
  "schedule": { "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD|null", "reminders": ["HH:MM"] },
  "notes": "string"
}

Metin: ${text}`;

    try {
      console.log('=== DEEPSEEK İŞLEMİ BAŞLADI ===');
      console.log('Prompt:', prompt);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'X-Title': 'İlaç Takip Uygulaması',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-maverick:free',
          messages: [
            {
              role: 'system',
              content: `Sen bir ilaç etiket bilgisi çözümleyicisin. Gelen metni sadece JSON olarak, yukarıdaki şablona uygun şekilde döndür. Saatleri yukarıdaki presetlerden seç veya varsayılan saatleri kullan.`
            },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) throw new Error(`DeepSeek API yanıt hatası: ${response.status}`);

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('DeepSeek API yanıtı boş');

      // JSON kod bloğu işaretlerini temizle
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      console.log('DeepSeek Temizlenmiş JSON:', cleaned);
      console.log('=== DEEPSEEK İŞLEMİ TAMAMLANDI ===');

      return cleaned;
    } catch (error) {
      console.error('DeepSeekService Hatası:', error);
      throw error;
    }
  }
}

import * as Notifications from 'expo-notifications';
import { getAllReminders, getUser } from './dataService';
import { 
    saveNotificationId, 
    getNotificationId, 
    removeNotificationId 
} from './notificationStore';
import { ReminderStatus } from '@/models/reminder';

// 🔹 Hatırlatma saatinden offset düşüp tetiklenme saatini hesaplar
function calculateTrigger(timeStr: string, offset: number): { hour: number; minute: number } {
    const [hour, minute] = timeStr.split(':').map(Number);
    let total = hour * 60 + minute - offset;
    total = (total + 24 * 60) % (24 * 60);
    return { hour: Math.floor(total / 60), minute: total % 60 };
}

// 🔹 Bildirim izinlerini kontrol eder
async function ensureNotificationPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        return newStatus === 'granted';
    }
    return true;
}

/**
 * Reminder veritabanındaki tüm aktif reminder'ları tarar,
 * mevcut bildirimleri günceller veya yeni planlar.
 */
export async function scheduleRemindersFromDatabase(): Promise<void> {
    console.log("=== Reminder Bazlı Bildirim Planlaması Başladı ===");

    const izin = await ensureNotificationPermission();
    if (!izin) {
        console.log("Bildirim izni yok. İşlem iptal.");
        return;
    }

    const user = await getUser();
    const offset = user.notificationPreferences.reminderTime || 0;

    const now = new Date();
    const allReminders = await getAllReminders();

    // 🔹 Geçmiş reminder'lar ve alınmış/atlanmış olanlar filtreleniyor
    const validReminders = allReminders.filter(r => {
        const reminderDateTime = new Date(`${r.date}T${r.time}`);
        return (
            reminderDateTime > now &&
            (!r.isTaken && r.status !== ReminderStatus.SKIPPED)
        );
    });

    console.log(`Planlanacak reminder sayısı: ${validReminders.length}`);

    for (const reminder of validReminders) {
        try {
            // 🔹 Eğer daha önce bu reminder için bir notification kurulduysa iptal et
            const existingNotifId = await getNotificationId(reminder.id);

            if (existingNotifId) {
                await Notifications.cancelScheduledNotificationAsync(existingNotifId);
                await removeNotificationId(reminder.id);
                console.log(`Eski bildirim iptal edildi: Reminder ID ${reminder.id}`);
            }

            // 🔹 Yeni notification için saat hesapla
            const { hour, minute } = calculateTrigger(reminder.time, offset);

            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: reminder.title,
                    body: reminder.description,
                    sound: user.notificationPreferences.sound ? 'default' : undefined,
                    data: { reminderId: reminder.id } // Bildirime ID eklendi, tıklanınca işlenebilir
                },
                trigger: {
                    type: 'daily',
                    hour,
                    minute,
                    repeats: true
                }
            });

            // 🔹 Yeni notificationId'yi NotificationStore'a kaydet
            await saveNotificationId(reminder.id, notificationId);

            const reminderDate = new Date(reminder.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            console.log(`Yeni bildirim planlandı: ${reminder.title} - Tarih: ${reminderDate} - Saat: ${hour}:${minute}`);

        } catch (err) {
            console.error(`Reminder ${reminder.id} için planlama hatası:`, err);
        }
    }

    console.log("=== Reminder Bazlı Bildirim Planlaması Tamamlandı ===");
}

/**
 * Tüm mevcut notification'ları iptal eder ve NotificationStore'u sıfırlar.
 */
export async function cancelAllSchedules(): Promise<void> {
    console.log("Tüm planlanmış bildirimler iptal ediliyor...");
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Bildirimler iptal edildi.");
    // NotificationStore'da da tüm kayıtları temizle (isteğe bağlı)
    // await clearNotificationStore(); // Eğer notificationStore.ts içine eklediysen
}

/**
 * Tek bir reminder için manuel bildirim gönderimi (debug/test amaçlı).
 */
export async function triggerManualNotification(reminderId: string): Promise<void> {
    const reminder = (await getAllReminders()).find(r => r.id === reminderId);

    if (!reminder) {
        console.log("Reminder bulunamadı.");
        return;
    }

    console.log('Manuel bildirim gönderiliyor:', reminder.title);

    const user = await getUser();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: reminder.title,
            body: reminder.description,
            sound: user.notificationPreferences.sound ? 'default' : undefined,
            data: { reminderId: reminder.id }
        },
        trigger: {
            seconds: 5,
            repeats: false
        }
    });

    console.log("Manuel bildirim gönderildi (5 saniye sonra).");
}

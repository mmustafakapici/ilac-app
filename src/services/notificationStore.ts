import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_STORE_KEY = "NOTIFICATION_STORE";

type NotificationStore = {
  [reminderId: string]: string; // reminderId → notificationId
};

// Tüm store'u getir
export async function getNotificationStore(): Promise<NotificationStore> {
  const json = await AsyncStorage.getItem(NOTIFICATION_STORE_KEY);
  return json ? JSON.parse(json) : {};
}

// Store'u kaydet
async function saveNotificationStore(store: NotificationStore) {
  await AsyncStorage.setItem(NOTIFICATION_STORE_KEY, JSON.stringify(store));
}

// ID kaydet
export async function saveNotificationId(reminderId: string, notificationId: string) {
  const store = await getNotificationStore();
  store[reminderId] = notificationId;
  await saveNotificationStore(store);
}

// ID getir
export async function getNotificationId(reminderId: string): Promise<string | null> {
  const store = await getNotificationStore();
  return store[reminderId] || null;
}

// ID sil
export async function removeNotificationId(reminderId: string) {
  const store = await getNotificationStore();
  delete store[reminderId];
  await saveNotificationStore(store);
}

// Tüm store'u temizle (debug için)
export async function clearNotificationStore() {
  await AsyncStorage.removeItem(NOTIFICATION_STORE_KEY);
}

// Debug fonksiyonu - Tüm notification keylerini ve değerlerini gösterir
export async function debugNotificationStore(): Promise<void> {
  try {
    const store = await getNotificationStore();
    console.log('=== Notification Store Debug Bilgisi ===');
    console.log('Toplam Kayıtlı Bildirim:', Object.keys(store).length);
    
    if (Object.keys(store).length === 0) {
      console.log('Henüz kayıtlı bildirim bulunmuyor.');
      return;
    }

    console.log('\nBildirim Detayları:');
    for (const [reminderId, notificationId] of Object.entries(store)) {
      console.log(`\nReminder ID: ${reminderId}`);
      console.log(`Notification ID: ${notificationId}`);
      console.log('------------------------');
    }
  } catch (error) {
    console.error('Notification store debug hatası:', error);
  }
}

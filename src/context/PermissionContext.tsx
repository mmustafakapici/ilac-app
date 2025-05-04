import React, { createContext, useContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import { initService } from "@/services/initService";

interface PermissionContextType {
  notificationPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

const PermissionContext = createContext<PermissionContextType>({
  notificationPermission: false,
  isLoading: true,
  error: null,
});

export const usePermission = () => useContext(PermissionContext);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 Uygulama başlatılıyor...");

    const initializeApp = async () => {
      try {
        console.log("📱 Bildirim izinleri kontrol ediliyor...");
        const { status } = await Notifications.requestPermissionsAsync();
        const hasPermission = status === "granted";
        setNotificationPermission(hasPermission);
        console.log(
          `📢 Bildirim izni durumu: ${
            hasPermission ? "✅ Verildi" : "❌ Verilmedi"
          }`
        );

        console.log("⚙️ Servisler başlatılıyor...");
        await initService();
        console.log("✅ Servisler başarıyla başlatıldı");
      } catch (err) {
        console.error("❌ Başlangıç hatası:", err);
        setError("Uygulama başlatılırken bir hata oluştu.");
      } finally {
        setIsLoading(false);
        console.log("🏁 Uygulama başlatma işlemi tamamlandı");
      }
    };

    initializeApp();
  }, []);

  return (
    <PermissionContext.Provider
      value={{ notificationPermission, isLoading, error }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

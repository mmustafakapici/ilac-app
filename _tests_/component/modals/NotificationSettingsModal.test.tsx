import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NotificationSettingsModal from "@/components/modals/NotificationSettingsModal";

describe("NotificationSettingsModal", () => {
  const user = {
    notificationPreferences: {
      sound: true,
      vibration: false,
      reminderTime: 10,
    },
    // Diğer gerekli user alanları eklenmeli
  };
  const onClose = jest.fn();

  it("modal başlığını ve switchleri gösterir", () => {
    const { getByText } = render(
      <NotificationSettingsModal visible={true} onClose={onClose} user={user} />
    );
    expect(getByText("Bildirim Ayarları")).toBeTruthy();
    expect(getByText("Sesli Bildirim")).toBeTruthy();
    expect(getByText("Titreşim")).toBeTruthy();
  });
});

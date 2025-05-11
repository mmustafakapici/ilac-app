import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import NotificationSettingsModal from "../../../../src/components/modals/NotificationSettingsModal";

describe("NotificationSettingsModal", () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    settings: {
      enabled: true,
      reminderTime: "09:00",
      reminderDays: ["Pazartesi", "Çarşamba", "Cuma"],
      soundEnabled: true,
      vibrationEnabled: true,
    },
  };

  it("modal görünür olduğunda render edilmeli", () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    expect(getByTestId("notification-settings-modal")).toBeTruthy();
  });

  it("modal görünmez olduğunda render edilmemeli", () => {
    const { queryByTestId } = render(
      <NotificationSettingsModal {...mockProps} visible={false} />
    );
    expect(queryByTestId("notification-settings-modal")).toBeNull();
  });

  it("bildirim ayarları doğru gösterilmeli", () => {
    const { getByText, getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    expect(getByText("Bildirim Ayarları")).toBeTruthy();
    expect(getByTestId("reminder-time")).toHaveTextContent("09:00");
  });

  it("bildirim günleri doğru gösterilmeli", () => {
    const { getByText } = render(<NotificationSettingsModal {...mockProps} />);
    expect(getByText("Pazartesi")).toBeTruthy();
    expect(getByText("Çarşamba")).toBeTruthy();
    expect(getByText("Cuma")).toBeTruthy();
  });

  it("ayarlar kaydedildiğinde onSave çağrılmalı", async () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith(mockProps.settings);
    });
  });

  it("kapatma butonu onClose'u çağırmalı", () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("bildirim zamanı değiştirildiğinde state güncellenmeli", () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("time-selector"));
    fireEvent(getByTestId("time-picker"), "onChange", {
      nativeEvent: { timestamp: new Date("2024-03-20T10:00:00").getTime() },
    });
    expect(getByTestId("reminder-time")).toHaveTextContent("10:00");
  });

  it("bildirim günleri değiştirildiğinde state güncellenmeli", () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("day-selector-Pazartesi"));
    expect(getByTestId("day-selector-Pazartesi")).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });

  it("ses ve titreşim ayarları değiştirildiğinde state güncellenmeli", () => {
    const { getByTestId } = render(
      <NotificationSettingsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("sound-toggle"));
    fireEvent.press(getByTestId("vibration-toggle"));
    expect(getByTestId("sound-toggle")).toHaveProp("value", false);
    expect(getByTestId("vibration-toggle")).toHaveProp("value", false);
  });
});

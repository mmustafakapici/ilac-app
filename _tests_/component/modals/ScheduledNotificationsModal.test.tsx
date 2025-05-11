import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ScheduledNotificationsModal from "../../../src/components/modals/ScheduledNotificationsModal";

describe("ScheduledNotificationsModal", () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    notifications: [
      {
        id: "1",
        title: "Parol",
        body: "500mg",
        time: "09:00",
        days: ["Pazartesi", "Çarşamba", "Cuma"],
      },
      {
        id: "2",
        title: "Aspirin",
        body: "100mg",
        time: "14:00",
        days: ["Salı", "Perşembe"],
      },
    ],
    onDelete: jest.fn(),
  };

  it("modal görünür olduğunda render edilmeli", () => {
    const { getByTestId } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    expect(getByTestId("scheduled-notifications-modal")).toBeTruthy();
  });

  it("modal görünmez olduğunda render edilmemeli", () => {
    const { queryByTestId } = render(
      <ScheduledNotificationsModal {...mockProps} visible={false} />
    );
    expect(queryByTestId("scheduled-notifications-modal")).toBeNull();
  });

  it("bildirimler listesi doğru gösterilmeli", () => {
    const { getByText } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("500mg")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
    expect(getByText("Aspirin")).toBeTruthy();
    expect(getByText("100mg")).toBeTruthy();
    expect(getByText("14:00")).toBeTruthy();
  });

  it("bildirim günleri doğru gösterilmeli", () => {
    const { getByText } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    expect(getByText("Pazartesi, Çarşamba, Cuma")).toBeTruthy();
    expect(getByText("Salı, Perşembe")).toBeTruthy();
  });

  it("bildirim silme butonu çalışmalı", () => {
    const { getAllByTestId } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    const deleteButtons = getAllByTestId("delete-notification-button");
    fireEvent.press(deleteButtons[0]);
    expect(mockProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("kapatma butonu onClose'u çağırmalı", () => {
    const { getByTestId } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("bildirim yoksa uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <ScheduledNotificationsModal {...mockProps} notifications={[]} />
    );
    expect(getByText("Planlanmış bildirim bulunmuyor")).toBeTruthy();
  });

  it("bildirim kartları doğru sıralanmalı", () => {
    const { getAllByTestId } = render(
      <ScheduledNotificationsModal {...mockProps} />
    );
    const notificationCards = getAllByTestId("notification-card");
    expect(notificationCards[0]).toHaveTextContent("Parol");
    expect(notificationCards[1]).toHaveTextContent("Aspirin");
  });
});

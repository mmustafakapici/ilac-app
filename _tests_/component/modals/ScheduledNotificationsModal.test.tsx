import React from "react";
import { render } from "@testing-library/react-native";
import ScheduledNotificationsModal from "@/components/modals/ScheduledNotificationsModal";

describe("ScheduledNotificationsModal", () => {
  const onClose = jest.fn();
  it("modal başlığını gösterir", () => {
    const { getByText } = render(
      <ScheduledNotificationsModal visible={true} onClose={onClose} />
    );
    expect(getByText("Planlanmış Bildirimler")).toBeTruthy();
  });
});

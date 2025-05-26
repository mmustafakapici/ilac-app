import React from "react";
import { render } from "@testing-library/react-native";
import CalendarComponent from "@/components/CalendarComponent";

describe("CalendarComponent", () => {
  const reminders = [
    { date: "2024-06-12", isTaken: true },
    { date: "2024-06-12", isTaken: false },
    { date: "2024-06-13", isTaken: true },
  ];

  it("takvim ve reminderları render eder", () => {
    const { getByText } = render(<CalendarComponent reminders={reminders} />);
    expect(getByText("2024-06-12")).toBeTruthy();
  });
});

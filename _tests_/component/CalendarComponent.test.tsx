import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarComponent from "../../src/components/CalendarComponent";

describe("CalendarComponent", () => {
  const mockProps = {
    selectedDate: new Date("2024-03-20"),
    onDateSelect: jest.fn(),
    markedDates: {
      "2024-03-20": { marked: true, dotColor: "blue" },
      "2024-03-21": { marked: true, dotColor: "red" },
    },
  };

  it("component render edilmeli", () => {
    const { getByTestId } = render(<CalendarComponent {...mockProps} />);
    expect(getByTestId("calendar")).toBeTruthy();
  });

  it("seçili tarih doğru gösterilmeli", () => {
    const { getByText } = render(<CalendarComponent {...mockProps} />);
    expect(getByText("20")).toBeTruthy();
  });

  it("işaretli tarihler doğru gösterilmeli", () => {
    const { getByTestId } = render(<CalendarComponent {...mockProps} />);
    const markedDates = getByTestId("calendar").props.markedDates;
    expect(markedDates["2024-03-20"].marked).toBeTruthy();
    expect(markedDates["2024-03-21"].marked).toBeTruthy();
  });

  it("tarih seçildiğinde onDateSelect çağrılmalı", () => {
    const { getByTestId } = render(<CalendarComponent {...mockProps} />);
    const newDate = new Date("2024-03-22");
    fireEvent(getByTestId("calendar"), "dayPress", {
      dateString: "2024-03-22",
    });
    expect(mockProps.onDateSelect).toHaveBeenCalledWith(newDate);
  });

  it("ay değiştiğinde takvim güncellenmeli", () => {
    const { getByTestId } = render(<CalendarComponent {...mockProps} />);
    fireEvent(getByTestId("calendar"), "monthChange", { month: 4, year: 2024 });
    expect(getByTestId("calendar")).toBeTruthy();
  });
});

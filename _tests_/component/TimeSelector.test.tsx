import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TimeSelector from "../../src/components/TimeSelector";

describe("TimeSelector", () => {
  const mockProps = {
    selectedTime: "09:00",
    onTimeChange: jest.fn(),
    label: "İlaç Saati",
  };

  it("component render edilmeli", () => {
    const { getByText } = render(<TimeSelector {...mockProps} />);
    expect(getByText("İlaç Saati")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
  });

  it("saat seçici açılmalı", () => {
    const { getByTestId } = render(<TimeSelector {...mockProps} />);
    fireEvent.press(getByTestId("time-selector-button"));
    expect(getByTestId("time-picker-modal")).toBeTruthy();
  });

  it("saat seçildiğinde onTimeChange çağrılmalı", () => {
    const { getByTestId } = render(<TimeSelector {...mockProps} />);
    fireEvent.press(getByTestId("time-selector-button"));
    fireEvent(getByTestId("time-picker"), "onChange", {
      nativeEvent: { timestamp: new Date("2024-03-20T10:00:00").getTime() },
    });
    expect(mockProps.onTimeChange).toHaveBeenCalledWith("10:00");
  });

  it("modal kapatıldığında seçim iptal edilmeli", () => {
    const { getByTestId } = render(<TimeSelector {...mockProps} />);
    fireEvent.press(getByTestId("time-selector-button"));
    fireEvent.press(getByTestId("cancel-button"));
    expect(getByText("09:00")).toBeTruthy(); // Seçili saat değişmemeli
  });

  it("label prop'u doğru gösterilmeli", () => {
    const { getByText } = render(<TimeSelector {...mockProps} />);
    expect(getByText("İlaç Saati")).toBeTruthy();
  });

  it("varsayılan label kullanılmalı", () => {
    const { getByText } = render(
      <TimeSelector selectedTime="09:00" onTimeChange={jest.fn()} />
    );
    expect(getByText("Saat Seçin")).toBeTruthy();
  });
});

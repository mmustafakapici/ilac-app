import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarFilterBar from "@/components/calendar/CalendarFilterBar";

describe("CalendarFilterBar", () => {
  const onSearch = jest.fn();
  const onFilterChange = jest.fn();
  it("filtre butonlarını ve arama alanını gösterir", () => {
    const { getByText, getByPlaceholderText } = render(
      <CalendarFilterBar
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        activeFilter="Tümü"
      />
    );
    expect(getByText("Tümü")).toBeTruthy();
    expect(getByText("Bugün")).toBeTruthy();
    expect(getByText("Bu Hafta")).toBeTruthy();
    expect(getByText("Bu Ay")).toBeTruthy();
    expect(getByPlaceholderText("İlaç ara...")).toBeTruthy();
  });
  it("filtre değiştirilebilir", () => {
    const { getByText } = render(
      <CalendarFilterBar
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        activeFilter="Tümü"
      />
    );
    fireEvent.press(getByText("Bugün"));
    expect(onFilterChange).toHaveBeenCalledWith("Bugün");
  });
});

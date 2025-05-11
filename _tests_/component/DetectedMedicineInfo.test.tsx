import React from "react";
import { render } from "@testing-library/react-native";
import DetectedMedicineInfo from "../../src/components/DetectedMedicineInfo";

describe("DetectedMedicineInfo", () => {
  const mockProps = {
    name: "Parol",
    dosage: "500mg",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    loading: false,
  };

  it("component render edilmeli", () => {
    const { getByText } = render(<DetectedMedicineInfo {...mockProps} />);
    expect(getByText("Parol")).toBeTruthy();
    expect(getByText("500mg")).toBeTruthy();
  });

  it("onConfirm ve onCancel butonları olmalı", () => {
    const { getByText } = render(<DetectedMedicineInfo {...mockProps} />);
    expect(getByText("Onayla")).toBeTruthy();
    expect(getByText("İptal")).toBeTruthy();
  });

  it("loading durumunda yükleniyor göstergesi olmalı", () => {
    const { getByTestId } = render(
      <DetectedMedicineInfo {...mockProps} loading={true} />
    );
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});

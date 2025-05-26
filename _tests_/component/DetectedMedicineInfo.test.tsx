import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DetectedMedicineInfo from "@/components/DetectedMedicineInfo";

describe("DetectedMedicineInfo", () => {
  const medicine = { name: "Parol" };
  const onUse = jest.fn();
  it("ilaç adını doğru gösterir", () => {
    const { getByText } = render(
      <DetectedMedicineInfo medicine={medicine} onUse={onUse} />
    );
    expect(getByText("Parol")).toBeTruthy();
  });
  it("Kullan butonuna tıklanabilir", () => {
    const { getByText } = render(
      <DetectedMedicineInfo medicine={medicine} onUse={onUse} />
    );
    fireEvent.press(getByText("Kullan"));
    expect(onUse).toHaveBeenCalled();
  });
});

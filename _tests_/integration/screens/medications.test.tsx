import React from "react";
import { render } from "@testing-library/react-native";
import MedicationsScreen from "@/screens/medications";

describe("MedicationsScreen entegrasyon", () => {
  it("ilaçlar başlığını ve ana UI elementlerini gösterir", () => {
    const { getByText } = render(<MedicationsScreen />);
    expect(getByText(/İlaçlar/i)).toBeTruthy();
    expect(getByText(/Ekle/)).toBeTruthy();
  });
});

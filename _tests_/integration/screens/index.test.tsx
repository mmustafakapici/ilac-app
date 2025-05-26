import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "@/screens/index";

describe("HomeScreen entegrasyon", () => {
  it("ana başlık ve önemli UI elementlerini gösterir", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/Hoşgeldiniz/i)).toBeTruthy();
    expect(getByText(/İlaçlar/)).toBeTruthy();
  });
});

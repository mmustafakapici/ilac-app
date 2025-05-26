import React from "react";
import { render } from "@testing-library/react-native";
import TabNavigator from "@/navigation/TabNavigator";

describe("TabNavigator entegrasyon", () => {
  it("ana sekmeleri gösterir", () => {
    const { getByText } = render(<TabNavigator />);
    expect(getByText(/Takvim/i)).toBeTruthy();
    expect(getByText(/Günlük/i)).toBeTruthy();
    expect(getByText(/Profil/i)).toBeTruthy();
    expect(getByText(/İlaçlar/i)).toBeTruthy();
  });
});

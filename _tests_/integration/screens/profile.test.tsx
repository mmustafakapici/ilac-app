import React from "react";
import { render } from "@testing-library/react-native";
import ProfileScreen from "@/screens/profile";

describe("ProfileScreen entegrasyon", () => {
  it("profil başlığını ve ana UI elementlerini gösterir", () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText(/Profil/i)).toBeTruthy();
    expect(getByText(/Kişisel Bilgiler/)).toBeTruthy();
  });
});

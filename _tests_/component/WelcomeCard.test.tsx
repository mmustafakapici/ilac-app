import React from "react";
import { render } from "@testing-library/react-native";
import WelcomeCard from "@/components/home/WelcomeCard";

describe("WelcomeCard", () => {
  it("kullanıcı adını ve tarihi doğru gösterir", () => {
    const { getByText } = render(
      <WelcomeCard userName="Mehmet" date="12 Haziran 2024" />
    );
    expect(getByText("Sağlıklı Günler, Mehmet")).toBeTruthy();
    expect(getByText("12 Haziran 2024")).toBeTruthy();
  });
});

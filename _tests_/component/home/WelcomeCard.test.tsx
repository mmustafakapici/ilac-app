import React from "react";
import { render } from "@testing-library/react-native";
import WelcomeCard from "../../../src/components/home/WelcomeCard";

describe("WelcomeCard", () => {
  const mockProps = {
    userName: "Ahmet",
    lastLogin: "2024-03-20T09:00:00",
  };

  it("component render edilmeli", () => {
    const { getByTestId } = render(<WelcomeCard {...mockProps} />);
    expect(getByTestId("welcome-card")).toBeTruthy();
  });

  it("kullanıcı adı doğru gösterilmeli", () => {
    const { getByText } = render(<WelcomeCard {...mockProps} />);
    expect(getByText("Merhaba, Ahmet")).toBeTruthy();
  });

  it("son giriş tarihi doğru formatlanmalı", () => {
    const { getByText } = render(<WelcomeCard {...mockProps} />);
    expect(getByText(/20 Mart 2024/)).toBeTruthy();
  });

  it("kullanıcı adı yoksa varsayılan mesaj gösterilmeli", () => {
    const { getByText } = render(
      <WelcomeCard {...mockProps} userName={undefined} />
    );
    expect(getByText("Merhaba")).toBeTruthy();
  });

  it("son giriş tarihi yoksa uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <WelcomeCard {...mockProps} lastLogin={undefined} />
    );
    expect(getByText("Hoş geldiniz")).toBeTruthy();
  });

  it("günün saatine göre doğru selamlama gösterilmeli", () => {
    const morningDate = "2024-03-20T09:00:00";
    const eveningDate = "2024-03-20T20:00:00";

    const { getByText: getByTextMorning } = render(
      <WelcomeCard {...mockProps} lastLogin={morningDate} />
    );
    expect(getByTextMorning(/Günaydın/)).toBeTruthy();

    const { getByText: getByTextEvening } = render(
      <WelcomeCard {...mockProps} lastLogin={eveningDate} />
    );
    expect(getByTextEvening(/İyi akşamlar/)).toBeTruthy();
  });
});

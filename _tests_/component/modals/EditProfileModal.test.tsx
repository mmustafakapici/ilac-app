import React from "react";
import { render } from "@testing-library/react-native";
import EditProfileModal from "@/components/modals/EditProfileModal";

describe("EditProfileModal", () => {
  const user = {
    firstName: "Mehmet",
    lastName: "Yılmaz",
    // Diğer gerekli user alanları eklenmeli
  };
  const onClose = jest.fn();

  it("modal başlığını ve inputları gösterir", () => {
    const { getByText } = render(
      <EditProfileModal visible={true} onClose={onClose} user={user} />
    );
    expect(getByText("Kişisel Bilgiler")).toBeTruthy();
    expect(getByText("Ad")).toBeTruthy();
    expect(getByText("Soyad")).toBeTruthy();
  });
});

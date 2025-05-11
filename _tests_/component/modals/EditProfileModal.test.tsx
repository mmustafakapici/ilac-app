import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EditProfileModal from "../../../src/components/modals/EditProfileModal";

describe("EditProfileModal", () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    profile: {
      name: "Ahmet Yılmaz",
      age: 30,
      gender: "Erkek",
      weight: 75,
      height: 180,
      medicalConditions: ["Hipertansiyon"],
      allergies: ["Penisilin"],
    },
  };

  it("modal görünür olduğunda render edilmeli", () => {
    const { getByTestId } = render(<EditProfileModal {...mockProps} />);
    expect(getByTestId("edit-profile-modal")).toBeTruthy();
  });

  it("modal görünmez olduğunda render edilmemeli", () => {
    const { queryByTestId } = render(
      <EditProfileModal {...mockProps} visible={false} />
    );
    expect(queryByTestId("edit-profile-modal")).toBeNull();
  });

  it("profil bilgileri doğru gösterilmeli", () => {
    const { getByDisplayValue } = render(<EditProfileModal {...mockProps} />);
    expect(getByDisplayValue("Ahmet Yılmaz")).toBeTruthy();
    expect(getByDisplayValue("30")).toBeTruthy();
    expect(getByDisplayValue("75")).toBeTruthy();
    expect(getByDisplayValue("180")).toBeTruthy();
  });

  it("form gönderildiğinde onSave çağrılmalı", async () => {
    const { getByTestId } = render(<EditProfileModal {...mockProps} />);
    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith(mockProps.profile);
    });
  });

  it("kapatma butonu onClose'u çağırmalı", () => {
    const { getByTestId } = render(<EditProfileModal {...mockProps} />);
    fireEvent.press(getByTestId("close-button"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("form validasyonu çalışmalı", async () => {
    const { getByTestId, getByText } = render(
      <EditProfileModal {...mockProps} />
    );
    fireEvent.changeText(getByTestId("name-input"), "");
    fireEvent.press(getByTestId("save-button"));

    await waitFor(() => {
      expect(getByText("İsim zorunludur")).toBeTruthy();
    });
  });

  it("sağlık durumu ve alerjiler doğru gösterilmeli", () => {
    const { getByText } = render(<EditProfileModal {...mockProps} />);
    expect(getByText("Hipertansiyon")).toBeTruthy();
    expect(getByText("Penisilin")).toBeTruthy();
  });

  it("yeni sağlık durumu eklenebilmeli", () => {
    const { getByTestId, getByText } = render(
      <EditProfileModal {...mockProps} />
    );
    fireEvent.changeText(getByTestId("medical-condition-input"), "Diyabet");
    fireEvent.press(getByTestId("add-medical-condition-button"));
    expect(getByText("Diyabet")).toBeTruthy();
  });

  it("yeni alerji eklenebilmeli", () => {
    const { getByTestId, getByText } = render(
      <EditProfileModal {...mockProps} />
    );
    fireEvent.changeText(getByTestId("allergy-input"), "Aspirin");
    fireEvent.press(getByTestId("add-allergy-button"));
    expect(getByText("Aspirin")).toBeTruthy();
  });

  it("mevcut sağlık durumu silinebilmeli", () => {
    const { getByTestId, queryByText } = render(
      <EditProfileModal {...mockProps} />
    );
    fireEvent.press(getByTestId("delete-medical-condition-Hipertansiyon"));
    expect(queryByText("Hipertansiyon")).toBeNull();
  });

  it("mevcut alerji silinebilmeli", () => {
    const { getByTestId, queryByText } = render(
      <EditProfileModal {...mockProps} />
    );
    fireEvent.press(getByTestId("delete-allergy-Penisilin"));
    expect(queryByText("Penisilin")).toBeNull();
  });
});

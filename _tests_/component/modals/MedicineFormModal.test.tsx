import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MedicineFormModal from "../../../src/components/modals/MedicineFormModal";

describe("MedicineFormModal", () => {
  const mockProps = {
    visible: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    initialData: null,
  };

  it("modal görünür olduğunda render edilmeli", () => {
    const { getByTestId } = render(<MedicineFormModal {...mockProps} />);
    expect(getByTestId("medicine-form-modal")).toBeTruthy();
  });

  it("modal görünmez olduğunda render edilmemeli", () => {
    const { queryByTestId } = render(
      <MedicineFormModal {...mockProps} visible={false} />
    );
    expect(queryByTestId("medicine-form-modal")).toBeNull();
  });

  it("form alanları doğru render edilmeli", () => {
    const { getByPlaceholderText } = render(
      <MedicineFormModal {...mockProps} />
    );
    expect(getByPlaceholderText("İlaç Adı")).toBeTruthy();
    expect(getByPlaceholderText("Dozaj")).toBeTruthy();
    expect(getByPlaceholderText("Notlar")).toBeTruthy();
  });

  it("form gönderildiğinde onSubmit çağrılmalı", async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <MedicineFormModal {...mockProps} />
    );

    fireEvent.changeText(getByPlaceholderText("İlaç Adı"), "Parol");
    fireEvent.changeText(getByPlaceholderText("Dozaj"), "500mg");
    fireEvent.press(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Parol",
          dosage: "500mg",
        })
      );
    });
  });

  it("düzenleme modunda başlangıç verileri doğru yüklenmeli", () => {
    const initialData = {
      id: "1",
      name: "Parol",
      dosage: "500mg",
      time: "09:00",
      days: ["Pazartesi"],
      notes: "Test notu",
    };

    const { getByDisplayValue } = render(
      <MedicineFormModal {...mockProps} initialData={initialData} />
    );

    expect(getByDisplayValue("Parol")).toBeTruthy();
    expect(getByDisplayValue("500mg")).toBeTruthy();
    expect(getByDisplayValue("Test notu")).toBeTruthy();
  });

  it("kapatma butonu onClose'u çağırmalı", () => {
    const { getByTestId } = render(<MedicineFormModal {...mockProps} />);
    fireEvent.press(getByTestId("close-button"));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("form validasyonu çalışmalı", async () => {
    const { getByTestId, getByText } = render(
      <MedicineFormModal {...mockProps} />
    );
    fireEvent.press(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByText("İlaç adı zorunludur")).toBeTruthy();
      expect(getByText("Dozaj zorunludur")).toBeTruthy();
    });
  });
});

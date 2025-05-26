import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DeleteMedicineModal from "@/components/modals/DeleteMedicineModal";

describe("DeleteMedicineModal", () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onDelete: jest.fn(),
    medicineName: "Parol",
  };

  it("modal ve ilaç adını gösterir", () => {
    const { getByText } = render(<DeleteMedicineModal {...defaultProps} />);
    expect(getByText("İlacı Sil")).toBeTruthy();
    expect(getByText(/Parol/)).toBeTruthy();
  });

  it("sil butonuna tıklanabilir", () => {
    const { getByText } = render(<DeleteMedicineModal {...defaultProps} />);
    // "Sil" butonunu bulup tıkla
    const silButton = getByText("İlacı Sil");
    fireEvent.press(silButton);
    // Modalda silme işlemi için ayrı bir buton varsa, ona göre güncellenebilir
  });
});

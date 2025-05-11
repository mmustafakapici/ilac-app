import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import MedicationsScreen from "../../../src/screens/medications";
import * as dataService from "../../../src/services/dataService";
import * as notificationStore from "../../../src/services/notificationStore";

// Mock servisleri
jest.mock("../../../src/services/dataService");
jest.mock("../../../src/services/notificationStore");

describe("MedicationsScreen Integration Tests", () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockMedications = [
    {
      id: "1",
      name: "Aspirin",
      dosage: "100mg",
      frequency: "daily",
      time: "08:00",
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000IU",
      frequency: "weekly",
      time: "12:00",
    },
  ];

  beforeEach(() => {
    // dataService mock'ları
    (dataService.getAllMedicines as jest.Mock).mockResolvedValue(mockMedications);
    (dataService.addMedicine as jest.Mock).mockResolvedValue(true);
    (dataService.updateMedicine as jest.Mock).mockResolvedValue(true);
    (dataService.deleteMedicine as jest.Mock).mockResolvedValue(true);

    // notificationStore mock'ları
    (notificationStore.getNotificationStore as jest.Mock).mockResolvedValue({});
    (notificationStore.saveNotificationId as jest.Mock).mockResolvedValue(true);
    (notificationStore.removeNotificationId as jest.Mock).mockResolvedValue(true);
  });

  it("ekran doğru render edilmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("medications-screen")).toBeTruthy();
  });

  it("geri butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("back-button"));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("ilaç ekleme butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("add-medication-button"));
    await waitFor(() => {
      expect(getByTestId("medicine-form-modal")).toBeTruthy();
    });
  });

  it("ilaç kartları doğru sıralanmalı", () => {
    const { getAllByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const medicationCards = getAllByTestId("medication-card");
    expect(medicationCards).toHaveLength(2);
  });

  it("ilaç düzenleme modalı açılmalı", async () => {
    const { getAllByTestId, getByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const editButtons = getAllByTestId("edit-medication-button");
    fireEvent.press(editButtons[0]);

    await waitFor(() => {
      expect(getByTestId("medicine-form-modal")).toBeTruthy();
    });
  });

  it("ilaç silme modalı açılmalı", async () => {
    const { getAllByTestId, getByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const deleteButtons = getAllByTestId("delete-medication-button");
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(getByTestId("delete-medicine-modal")).toBeTruthy();
    });
  });

  it("ilaç arama çalışmalı", async () => {
    const { getByTestId, getAllByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const searchInput = getByTestId("search-input");
    fireEvent.changeText(searchInput, "Aspirin");

    await waitFor(() => {
      const medicationCards = getAllByTestId("medication-card");
      expect(medicationCards).toHaveLength(1);
    });
  });

  it("ilaç filtreleme çalışmalı", async () => {
    const { getByTestId, getAllByTestId } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const filterButton = getByTestId("filter-button");
    fireEvent.press(filterButton);

    const mondayFilter = getByTestId("filter-day-Pazartesi");
    fireEvent.press(mondayFilter);

    await waitFor(() => {
      const medicationCards = getAllByTestId("medication-card");
      expect(medicationCards).toHaveLength(1);
    });
  });

  it("veri yoksa uygun mesaj gösterilmeli", () => {
    (dataService.getAllMedicines as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Henüz ilaç eklenmemiş")).toBeTruthy();
  });

  it("arama sonucu boşsa uygun mesaj gösterilmeli", async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <MedicationsScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const searchInput = getByTestId("search-input");
    fireEvent.changeText(searchInput, "Olmayan İlaç");

    await waitFor(() => {
      expect(getByText("Arama sonucu bulunamadı")).toBeTruthy();
    });
  });
});

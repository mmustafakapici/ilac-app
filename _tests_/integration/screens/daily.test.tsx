import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import DailyScreen from "../../../src/screens/daily";
import * as dataService from "../../../src/services/dataService";
import * as notificationStore from "../../../src/services/notificationStore";

// Mock servisleri
jest.mock("../../../src/services/dataService");
jest.mock("../../../src/services/notificationStore");

describe("DailyScreen Integration Tests", () => {
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
      taken: false,
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000IU",
      frequency: "weekly",
      time: "12:00",
      taken: true,
    },
  ];

  beforeEach(() => {
    // dataService mock'ları
    (dataService.getAllMedicines as jest.Mock).mockResolvedValue(
      mockMedications
    );
    (dataService.updateMedicine as jest.Mock).mockResolvedValue(true);

    // notificationStore mock'ları
    (notificationStore.getNotificationStore as jest.Mock).mockResolvedValue({});
    (notificationStore.saveNotificationId as jest.Mock).mockResolvedValue(true);
    (notificationStore.removeNotificationId as jest.Mock).mockResolvedValue(
      true
    );
  });

  it("ekran doğru render edilmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("daily-screen")).toBeTruthy();
  });

  it("geri butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("back-button"));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("tarih seçici görünmeli ve çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const dateSelector = getByTestId("date-selector");
    expect(dateSelector).toBeTruthy();

    fireEvent.press(dateSelector);
    await waitFor(() => {
      expect(getByTestId("date-picker-modal")).toBeTruthy();
    });
  });

  it("ilaç kartları doğru sıralanmalı", () => {
    const { getAllByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const medicationCards = getAllByTestId("medication-card");
    expect(medicationCards).toHaveLength(2);
  });

  it("ilaç alındı olarak işaretlenebilmeli", async () => {
    const mockMarkAsTaken = jest.fn();
    (dataService.getAllMedicines as jest.Mock).mockReturnValue({
      then: (callback) => {
        callback(mockMedications);
      },
    });

    const { getAllByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const takeButtons = getAllByTestId("take-medication-button");
    fireEvent.press(takeButtons[0]);

    await waitFor(() => {
      expect(mockMarkAsTaken).toHaveBeenCalledWith("1");
    });
  });

  it("ilaç düzenleme modalı açılmalı", async () => {
    const { getAllByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const editButtons = getAllByTestId("edit-medication-button");
    fireEvent.press(editButtons[0]);

    await waitFor(() => {
      expect(getByTestId("medicine-form-modal")).toBeTruthy();
    });
  });

  it("ilaç silme modalı açılmalı", async () => {
    const { getAllByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const deleteButtons = getAllByTestId("delete-medication-button");
    fireEvent.press(deleteButtons[0]);

    await waitFor(() => {
      expect(getByTestId("delete-medicine-modal")).toBeTruthy();
    });
  });

  it("günlük ilerleme doğru hesaplanmalı", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const progressText = getByTestId("daily-progress-text");
    expect(progressText.props.children).toBe("1/2 ilaç alındı");
  });

  it("veri yoksa uygun mesaj gösterilmeli", () => {
    (dataService.getAllMedicines as jest.Mock).mockReturnValue({
      then: (callback) => {
        callback([]);
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <DailyScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Bu gün için planlanmış ilaç bulunmuyor")).toBeTruthy();
  });
});

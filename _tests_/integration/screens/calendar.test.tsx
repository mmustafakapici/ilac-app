import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import CalendarScreen from "../../../src/screens/calendar";
import * as dataService from "../../../src/services/dataService";
import * as notificationStore from "../../../src/services/notificationStore";

// Mock servisleri
jest.mock("../../../src/services/dataService");
jest.mock("../../../src/services/notificationStore");

describe("CalendarScreen Integration Tests", () => {
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
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "1000IU",
      frequency: "weekly",
      time: "12:00",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
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
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("calendar-screen")).toBeTruthy();
  });

  it("geri butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("back-button"));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("takvim bileşeni görünmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("calendar-component")).toBeTruthy();
  });

  it("seçilen güne ait ilaçlar listelenmeli", async () => {
    const { getByTestId, getAllByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Pazartesi gününü seç
    const mondayCell = getByTestId("calendar-day-Pazartesi");
    fireEvent.press(mondayCell);

    await waitFor(() => {
      const medicationCards = getAllByTestId("calendar-medication-card");
      expect(medicationCards).toHaveLength(1); // Sadece Parol görünmeli
    });
  });

  it("ilaç kartına tıklandığında detay modalı açılmalı", async () => {
    const { getByTestId, getAllByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Pazartesi gününü seç
    const mondayCell = getByTestId("calendar-day-Pazartesi");
    fireEvent.press(mondayCell);

    // İlaç kartına tıkla
    const medicationCard = getAllByTestId("calendar-medication-card")[0];
    fireEvent.press(medicationCard);

    await waitFor(() => {
      expect(getByTestId("medicine-detail-modal")).toBeTruthy();
    });
  });

  it("ay değiştirildiğinde takvim güncellenmeli", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const nextMonthButton = getByTestId("next-month-button");
    fireEvent.press(nextMonthButton);

    await waitFor(() => {
      expect(getByTestId("calendar-header")).toHaveTextContent(/Sonraki Ay/);
    });
  });

  it("veri yoksa uygun mesaj gösterilmeli", () => {
    (dataService.getAllMedicines as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Bu ay için planlanmış ilaç bulunmuyor")).toBeTruthy();
  });

  it("takvimde işaretli günler doğru gösterilmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const mondayCell = getByTestId("calendar-day-Pazartesi");
    const tuesdayCell = getByTestId("calendar-day-Salı");

    expect(mondayCell.props.style).toHaveProperty("backgroundColor", "#E3F2FD");
    expect(tuesdayCell.props.style).toHaveProperty(
      "backgroundColor",
      "#E3F2FD"
    );
  });

  it("takvimde alınmış ilaçlar doğru işaretlenmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CalendarScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    const tuesdayCell = getByTestId("calendar-day-Salı");
    expect(tuesdayCell.props.style).toHaveProperty("borderColor", "#4CAF50");
  });
});

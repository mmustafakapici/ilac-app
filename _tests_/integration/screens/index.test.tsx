import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../../../src/screens/index";

// Mock store'ları
// jest.mock("../../../src/stores/notificationStore");
// jest.mock("../../../src/stores/dataStore");

describe("HomeScreen Integration Tests", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    // Mock store değerlerini ayarla
    // (useNotificationStore as jest.Mock).mockReturnValue({
    //   notifications: [],
    //   addNotification: jest.fn(),
    //   removeNotification: jest.fn(),
    // });
    // (useDataStore as jest.Mock).mockReturnValue({
    //   medications: [
    //     {
    //       id: "1",
    //       name: "Parol",
    //       dosage: "500mg",
    //       time: "09:00",
    //       days: ["Pazartesi"],
    //     },
    //   ],
    //   addMedication: jest.fn(),
    //   updateMedication: jest.fn(),
    //   deleteMedication: jest.fn(),
    // });
  });

  it("ekran doğru render edilmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("home-screen")).toBeTruthy();
  });

  it("yaklaşan ilaçlar kartı görünmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("upcoming-medications-card")).toBeTruthy();
  });

  it("günlük ilerleme kartı görünmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("daily-progress-card")).toBeTruthy();
  });

  it("haftalık istatistikler kartı görünmeli", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("weekly-stats-card")).toBeTruthy();
  });

  it("ilaç ekleme butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("add-medication-button"));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Medications");
    });
  });

  it("profil butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("profile-button"));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Profile");
    });
  });

  it("takvim butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("calendar-button"));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Calendar");
    });
  });

  it("günlük görünüm butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("daily-view-button"));
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Daily");
    });
  });

  it("bildirim ayarları butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("notification-settings-button"));
    await waitFor(() => {
      expect(getByTestId("notification-settings-modal")).toBeTruthy();
    });
  });

  it("veri yoksa uygun mesajlar gösterilmeli", () => {
    // (useDataStore as jest.Mock).mockReturnValue({
    //   medications: [],
    //   addMedication: jest.fn(),
    //   updateMedication: jest.fn(),
    //   deleteMedication: jest.fn(),
    // });

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Yaklaşan ilaç bulunmuyor")).toBeTruthy();
    expect(getByText("Bugün için planlanmış ilaç yok")).toBeTruthy();
    expect(getByText("Bu hafta için veri bulunmuyor")).toBeTruthy();
  });
});

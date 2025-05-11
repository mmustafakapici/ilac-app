import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "../../../src/screens/profile";
import * as dataService from "../../../src/services/dataService";
import * as notificationStore from "../../../src/services/notificationStore";

// Mock servisleri
jest.mock("../../../src/services/dataService");
jest.mock("../../../src/services/notificationStore");

describe("ProfileScreen Integration Tests", () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockUserData = {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "5551234567",
    emergencyContact: "Ayşe Yılmaz",
    emergencyPhone: "5559876543",
  };

  beforeEach(() => {
    // dataService mock'ları
    (dataService.getUser as jest.Mock).mockResolvedValue(mockUserData);
    (dataService.updateUser as jest.Mock).mockResolvedValue(true);
    (dataService.getAllMedicines as jest.Mock).mockResolvedValue([]);
    (dataService.addMedicine as jest.Mock).mockResolvedValue(true);
    (dataService.updateMedicine as jest.Mock).mockResolvedValue(true);
    (dataService.deleteMedicine as jest.Mock).mockResolvedValue(true);

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
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByTestId("profile-screen")).toBeTruthy();
  });

  it("geri butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("back-button"));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("kullanıcı bilgileri doğru görüntülenmeli", () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText(mockUserData.name)).toBeTruthy();
    expect(getByText(mockUserData.email)).toBeTruthy();
    expect(getByText(mockUserData.phone)).toBeTruthy();
    expect(getByText(mockUserData.emergencyContact)).toBeTruthy();
    expect(getByText(mockUserData.emergencyPhone)).toBeTruthy();
  });

  it("profil düzenleme modalı açılmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("edit-profile-button"));
    await waitFor(() => {
      expect(getByTestId("edit-profile-modal")).toBeTruthy();
    });
  });

  it("bildirim ayarları modalı açılmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("notification-settings-button"));
    await waitFor(() => {
      expect(getByTestId("notification-settings-modal")).toBeTruthy();
    });
  });

  it("planlanmış bildirimler modalı açılmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("scheduled-notifications-button"));
    await waitFor(() => {
      expect(getByTestId("scheduled-notifications-modal")).toBeTruthy();
    });
  });

  it("veri yedekleme butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("backup-data-button"));
    await waitFor(() => {
      expect(getByTestId("backup-success-message")).toBeTruthy();
    });
  });

  it("veri geri yükleme butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("restore-data-button"));
    await waitFor(() => {
      expect(getByTestId("restore-success-message")).toBeTruthy();
    });
  });

  it("uygulama hakkında modalı açılmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("about-button"));
    await waitFor(() => {
      expect(getByTestId("about-modal")).toBeTruthy();
    });
  });

  it("çıkış yapma butonu çalışmalı", async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId("logout-button"));
    await waitFor(() => {
      expect(getByTestId("logout-confirmation-modal")).toBeTruthy();
    });
  });

  it("kullanıcı verisi yoksa uygun mesaj gösterilmeli", () => {
    (dataService.getUser as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText("Profil bilgileri bulunamadı")).toBeTruthy();
  });
});

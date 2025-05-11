import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../src/screens/index";
import DailyScreen from "../../../src/screens/daily";
import CalendarScreen from "../../../src/screens/calendar";
import MedicationsScreen from "../../../src/screens/medications";
import ProfileScreen from "../../../src/screens/profile";
import { useDataStore } from "../../../src/stores/dataStore";
import { useNotificationStore } from "../../../src/stores/notificationStore";

// Mock store'ları
jest.mock("../../../src/stores/dataStore");
jest.mock("../../../src/stores/notificationStore");

const Stack = createStackNavigator();

const mockMedications = [
  {
    id: "1",
    name: "Parol",
    dosage: "500mg",
    time: "09:00",
    days: ["Pazartesi"],
    taken: false,
  },
];

const mockUserData = {
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  phone: "5551234567",
  emergencyContact: "Ayşe Yılmaz",
  emergencyPhone: "5559876543",
};

function NavigationWrapper() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Medications" component={MedicationsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

describe("Navigation Integration Tests", () => {
  beforeEach(() => {
    (useDataStore as jest.Mock).mockReturnValue({
      medications: mockMedications,
      userData: mockUserData,
      addMedication: jest.fn(),
      updateMedication: jest.fn(),
      deleteMedication: jest.fn(),
      updateUserData: jest.fn(),
    });

    (useNotificationStore as jest.Mock).mockReturnValue({
      notifications: [],
      addNotification: jest.fn(),
      removeNotification: jest.fn(),
    });
  });

  it("ana sayfadan günlük görünüme geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    fireEvent.press(getByTestId("daily-view-button"));
    await waitFor(() => {
      expect(getByTestId("daily-screen")).toBeTruthy();
    });
  });

  it("ana sayfadan takvime geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    fireEvent.press(getByTestId("calendar-button"));
    await waitFor(() => {
      expect(getByTestId("calendar-screen")).toBeTruthy();
    });
  });

  it("ana sayfadan ilaçlara geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    fireEvent.press(getByTestId("add-medication-button"));
    await waitFor(() => {
      expect(getByTestId("medications-screen")).toBeTruthy();
    });
  });

  it("ana sayfadan profile geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    fireEvent.press(getByTestId("profile-button"));
    await waitFor(() => {
      expect(getByTestId("profile-screen")).toBeTruthy();
    });
  });

  it("geri butonu ile önceki ekrana dönülebilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    // Önce günlük görünüme git
    fireEvent.press(getByTestId("daily-view-button"));
    await waitFor(() => {
      expect(getByTestId("daily-screen")).toBeTruthy();
    });

    // Geri butonuna bas
    fireEvent.press(getByTestId("back-button"));
    await waitFor(() => {
      expect(getByTestId("home-screen")).toBeTruthy();
    });
  });

  it("ilaçlar ekranından ilaç ekleme modalına geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    // İlaçlar ekranına git
    fireEvent.press(getByTestId("add-medication-button"));
    await waitFor(() => {
      expect(getByTestId("medications-screen")).toBeTruthy();
    });

    // İlaç ekleme butonuna bas
    fireEvent.press(getByTestId("add-medication-button"));
    await waitFor(() => {
      expect(getByTestId("medicine-form-modal")).toBeTruthy();
    });
  });

  it("profil ekranından bildirim ayarlarına geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    // Profil ekranına git
    fireEvent.press(getByTestId("profile-button"));
    await waitFor(() => {
      expect(getByTestId("profile-screen")).toBeTruthy();
    });

    // Bildirim ayarları butonuna bas
    fireEvent.press(getByTestId("notification-settings-button"));
    await waitFor(() => {
      expect(getByTestId("notification-settings-modal")).toBeTruthy();
    });
  });

  it("takvim ekranından ilaç detayına geçiş yapılabilmeli", async () => {
    const { getByTestId, getAllByTestId } = render(<NavigationWrapper />);

    // Takvim ekranına git
    fireEvent.press(getByTestId("calendar-button"));
    await waitFor(() => {
      expect(getByTestId("calendar-screen")).toBeTruthy();
    });

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

  it("günlük görünümden ilaç düzenleme modalına geçiş yapılabilmeli", async () => {
    const { getByTestId, getAllByTestId } = render(<NavigationWrapper />);

    // Günlük görünüme git
    fireEvent.press(getByTestId("daily-view-button"));
    await waitFor(() => {
      expect(getByTestId("daily-screen")).toBeTruthy();
    });

    // İlaç düzenleme butonuna bas
    const editButtons = getAllByTestId("edit-medication-button");
    fireEvent.press(editButtons[0]);

    await waitFor(() => {
      expect(getByTestId("medicine-form-modal")).toBeTruthy();
    });
  });

  it("profil ekranından çıkış yapma modalına geçiş yapılabilmeli", async () => {
    const { getByTestId } = render(<NavigationWrapper />);

    // Profil ekranına git
    fireEvent.press(getByTestId("profile-button"));
    await waitFor(() => {
      expect(getByTestId("profile-screen")).toBeTruthy();
    });

    // Çıkış yapma butonuna bas
    fireEvent.press(getByTestId("logout-button"));
    await waitFor(() => {
      expect(getByTestId("logout-confirmation-modal")).toBeTruthy();
    });
  });
});

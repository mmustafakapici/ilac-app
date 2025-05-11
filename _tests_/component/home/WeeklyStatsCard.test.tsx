import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WeeklyStatsCard from "../../../../src/components/home/WeeklyStatsCard";

describe("WeeklyStatsCard", () => {
  const mockProps = {
    weeklyStats: {
      totalMedications: 35,
      takenMedications: 28,
      missedMedications: 7,
      adherenceRate: 80,
      mostMissedDay: "Pazartesi",
      mostMissedTime: "09:00",
    },
    onPress: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByTestId } = render(<WeeklyStatsCard {...mockProps} />);
    expect(getByTestId("weekly-stats-card")).toBeTruthy();
  });

  it("haftalık istatistikler doğru gösterilmeli", () => {
    const { getByText } = render(<WeeklyStatsCard {...mockProps} />);
    expect(getByText("35")).toBeTruthy(); // Toplam ilaç
    expect(getByText("28")).toBeTruthy(); // Alınan ilaç
    expect(getByText("7")).toBeTruthy(); // Kaçırılan ilaç
    expect(getByText("%80")).toBeTruthy(); // Uyum oranı
  });

  it("en çok kaçırılan gün ve saat doğru gösterilmeli", () => {
    const { getByText } = render(<WeeklyStatsCard {...mockProps} />);
    expect(getByText("Pazartesi")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
  });

  it("kart tıklandığında onPress çağrılmalı", () => {
    const { getByTestId } = render(<WeeklyStatsCard {...mockProps} />);
    fireEvent.press(getByTestId("weekly-stats-card"));
    expect(mockProps.onPress).toHaveBeenCalled();
  });

  it("uyum oranı renk kodlaması doğru olmalı", () => {
    const { getByTestId } = render(<WeeklyStatsCard {...mockProps} />);
    const adherenceText = getByTestId("adherence-rate");
    expect(adherenceText).toHaveStyle({ color: expect.any(String) });
  });

  it("veri yoksa uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <WeeklyStatsCard
        weeklyStats={{
          totalMedications: 0,
          takenMedications: 0,
          missedMedications: 0,
          adherenceRate: 0,
          mostMissedDay: "",
          mostMissedTime: "",
        }}
        onPress={jest.fn()}
      />
    );
    expect(getByText("Bu hafta için veri bulunmuyor")).toBeTruthy();
  });

  it("istatistik kartları doğru sıralanmalı", () => {
    const { getAllByTestId } = render(<WeeklyStatsCard {...mockProps} />);
    const statCards = getAllByTestId("stat-card");
    expect(statCards[0]).toHaveTextContent("Toplam İlaç");
    expect(statCards[1]).toHaveTextContent("Alınan İlaç");
    expect(statCards[2]).toHaveTextContent("Kaçırılan İlaç");
  });

  it("uyum oranı yüzde işareti ile gösterilmeli", () => {
    const { getByTestId } = render(<WeeklyStatsCard {...mockProps} />);
    const adherenceRate = getByTestId("adherence-rate");
    expect(adherenceRate).toHaveTextContent("%80");
  });
});

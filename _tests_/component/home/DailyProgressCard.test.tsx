import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DailyProgressCard from "../../../../src/components/home/DailyProgressCard";

describe("DailyProgressCard", () => {
  const mockProps = {
    totalMedications: 5,
    takenMedications: 3,
    onPress: jest.fn(),
  };

  it("component render edilmeli", () => {
    const { getByTestId } = render(<DailyProgressCard {...mockProps} />);
    expect(getByTestId("daily-progress-card")).toBeTruthy();
  });

  it("toplam ilaç sayısı doğru gösterilmeli", () => {
    const { getByText } = render(<DailyProgressCard {...mockProps} />);
    expect(getByText("5")).toBeTruthy();
  });

  it("alınan ilaç sayısı doğru gösterilmeli", () => {
    const { getByText } = render(<DailyProgressCard {...mockProps} />);
    expect(getByText("3")).toBeTruthy();
  });

  it("ilerleme yüzdesi doğru hesaplanmalı", () => {
    const { getByTestId } = render(<DailyProgressCard {...mockProps} />);
    const progressBar = getByTestId("progress-bar");
    expect(progressBar.props.progress).toBe(0.6); // 3/5 = 0.6
  });

  it("kart tıklandığında onPress çağrılmalı", () => {
    const { getByTestId } = render(<DailyProgressCard {...mockProps} />);
    fireEvent.press(getByTestId("daily-progress-card"));
    expect(mockProps.onPress).toHaveBeenCalled();
  });

  it("tüm ilaçlar alındığında uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <DailyProgressCard
        {...mockProps}
        totalMedications={3}
        takenMedications={3}
      />
    );
    expect(getByText("Tüm ilaçlarınızı aldınız!")).toBeTruthy();
  });

  it("hiç ilaç alınmadığında uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <DailyProgressCard
        {...mockProps}
        totalMedications={3}
        takenMedications={0}
      />
    );
    expect(getByText("Henüz ilaç alınmadı")).toBeTruthy();
  });

  it("ilerleme mesajı doğru gösterilmeli", () => {
    const { getByText } = render(<DailyProgressCard {...mockProps} />);
    expect(getByText("3/5 ilaç alındı")).toBeTruthy();
  });

  it("toplam ilaç sayısı 0 ise uygun mesaj gösterilmeli", () => {
    const { getByText } = render(
      <DailyProgressCard
        {...mockProps}
        totalMedications={0}
        takenMedications={0}
      />
    );
    expect(getByText("Bugün için planlanmış ilaç yok")).toBeTruthy();
  });
});

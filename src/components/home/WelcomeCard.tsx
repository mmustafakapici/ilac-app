import { StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

interface WelcomeCardProps {
  userName: string;
  date: string;
}

export default function WelcomeCard({ userName, date }: WelcomeCardProps) {
  return (
    <View
      style={[
        localStyles.container,
        {
          backgroundColor: styles.colors.card,
          borderRadius: styles.borderRadius.md,
        },
      ]}
    >
      <View style={localStyles.header}>
        <View style={localStyles.userInfo}>
          <View
            style={[
              localStyles.avatar,
              { backgroundColor: styles.colors.primary },
            ]}
          >
            <FontAwesome name="user" size={24} color="white" />
          </View>
          <View style={{ marginLeft: styles.spacing.md }}>
            <Text style={[styles.typography.h2, { color: styles.colors.text }]}>
              Sağlıklı Günler, {userName}
            </Text>
            <Text
              style={[
                styles.typography.body,
                { marginTop: 4, color: styles.colors.text },
              ]}
            >
              {date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

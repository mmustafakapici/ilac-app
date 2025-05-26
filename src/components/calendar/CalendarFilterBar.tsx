import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/constants/theme";

interface CalendarFilterBarProps {
  onSearch: (text: string) => void;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

export default function CalendarFilterBar({
  onSearch,
  onFilterChange,
  activeFilter,
}: CalendarFilterBarProps) {
  const filters = ["Tümü", "Bugün", "Bu Hafta", "Bu Ay"];

  return (
    <View style={localStyles.container}>
      <View style={localStyles.searchContainer}>
        <MaterialIcons name="search" size={20} color={styles.colors.text} />
        <TextInput
          style={localStyles.searchInput}
          placeholder="İlaç ara..."
          placeholderTextColor={styles.colors.textSecondary}
          onChangeText={onSearch}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={localStyles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              localStyles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter
                    ? styles.colors.primary
                    : styles.colors.card,
              },
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text
              style={[
                styles.typography.body,
                {
                  color: activeFilter === filter ? "white" : styles.colors.text,
                },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: styles.colors.card,
    borderRadius: styles.borderRadius.md,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: styles.colors.text,
    ...styles.typography.body,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: styles.borderRadius.md,
    marginRight: 8,
    borderWidth: 1,
    borderColor: styles.colors.border,
  },
});

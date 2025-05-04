import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic async storage wrapper for key–value operations.
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? (JSON.parse(json) as T) : null;
  } catch (e) {
    console.error(`Error reading key "${key}" from storage:`, e);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (e) {
    console.error(`Error writing key "${key}" to storage:`, e);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing key "${key}" from storage:`, e);
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}

import "react-native-gesture-handler/jestSetup";

// ➤ React Native Reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// ➤ Async Storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ➤ Expo Notifications
jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
}));

// ➤ Expo Device
jest.mock("expo-device", () => ({
  brand: "MockBrand",
  modelName: "MockModel",
  osName: "iOS",
  osVersion: "14.4",
  totalMemory: 2048,
  isDevice: true,
}));

// ➤ Expo Constants
jest.mock("expo-constants", () => ({
  default: {
    manifest: {
      version: "1.0.0",
      name: "MockApp",
    },
    executionEnvironment: "standalone",
    platform: { ios: { buildNumber: "1.0.0" } },
  },
}));

// ➤ NetInfo
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// ➤ Navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  dangerouslyGetState: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
};

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({ params: {} }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

// ➤ Date mock
const mockDate = new Date("2024-01-01T00:00:00.000Z");
global.Date = class extends Date {
  constructor(date) {
    if (date) {
      return super(date);
    }
    return mockDate;
  }
};

// ➤ Global console mocks
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// ➤ React Native Mock
jest.mock("react-native", () => {
  return {
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: "ios",
      select: jest.fn((obj) => obj.ios),
    },
    PermissionsAndroid: {
      request: jest.fn(),
      check: jest.fn(),
      RESULTS: {},
      PERMISSIONS: {},
    },
    NativeModules: {},
    NativeEventEmitter: jest.fn(),
    StyleSheet: {
      create: jest.fn((styles) => styles),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    PixelRatio: {
      get: jest.fn(() => 2),
      roundToNearestPixel: jest.fn((n) => Math.round(n)),
    },
    UIManager: {
      measure: jest.fn(),
      measureInWindow: jest.fn(),
      dispatchViewManagerCommand: jest.fn(),
      // required by react-native-gesture-handler
      RCTView: () => {},
    },
    findNodeHandle: jest.fn(),
  };
});

jest.mock("react-native-svg", () => {
  const React = require("react");
  return {
    Svg: (props) => React.createElement("svg", props),
    Path: (props) => React.createElement("path", props),
    // Diğer svg elemanları eklenebilir
  };
});

jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  NativeModule: {},
  requireNativeModule: () => ({}),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 812 }),
}));

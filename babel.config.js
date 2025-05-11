module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@services": "./src/services",
            "@store": "./src/store",
            "@constants": "./src/constants",
            "@assets": "./src/assets",
            "@types": "./src/types",
            "@navigation": "./src/navigation",
            "@theme": "./src/theme",
            "@mocks": "./_tests_/mocks",
          },
        },
      ],
    ],
  };
};

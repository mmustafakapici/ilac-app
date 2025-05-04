module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    // .env desteği
    [
      "module:react-native-dotenv",
      { moduleName: "@env", path: ".env", safe: false, allowUndefined: true },
    ],
    // alias’lar için
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./src",
        },
      },
    ],
  ],
};

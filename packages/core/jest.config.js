module.exports = {
  testEnvironment: "node",
  roots: ["src/__tests__"],
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

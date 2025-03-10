import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "^app-icons-v1.0/(.*)$": "<rootDir>/app-icons-v1.0/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^react$": "<rootDir>/node_modules/react",
  },
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|.*flat.*)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
};

export default config;

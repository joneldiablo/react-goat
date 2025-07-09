import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^app-icons-v1.0/(.*)$": "<rootDir>/app-icons-v1.0/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^react$": "<rootDir>/node_modules/react",
    "^swiper/react$": "<rootDir>/__mocks__/swiper/react.js",
    "^swiper/modules$": "<rootDir>/__mocks__/swiper/modules.js",
    "^@splidejs/react-splide$": "<rootDir>/__mocks__/@splidejs/react-splide.js",
    "^react-youtube$": "<rootDir>/__mocks__/react-youtube.js",
  },
  testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$|.*flat.*)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
};

export default config;

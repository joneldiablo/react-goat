import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ['**/e2e/**/*.e2e.ts'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|.*flat.*)'],
  coverageDirectory: 'coverage_e2e'
};

export default config;

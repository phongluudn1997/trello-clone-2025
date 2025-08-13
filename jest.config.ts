// jest.config.ts

import type { Config } from "jest";

const config: Config = {
  rootDir: "./",
  // The test environment that will be used
  testEnvironment: "jsdom",
  // A list of paths to modules that run after the test environment is set up
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  // An array of regexp pattern strings that are matched against all source file paths,
  // matched files will be processed with the transformer.
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.jsx?$": ["ts-jest", { useESM: true }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-error-boundary)", // allow Jest to transform it
  ],
  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    // This handles CSS imports
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    // This handles image and other asset imports
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/mocks/fileMock.js",
  },
};

export default config;

import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs" } }],
  },
  testMatch: ["**/app/**/*.test.{ts,tsx}"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

export default config;

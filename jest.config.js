module.exports = {
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  globalSetup: "<rootDir>/test/jest-setup.ts",
  globalTeardown: "<rootDir>/test/jest-teardown.ts",
  setupFilesAfterEnv: ["jest-extended/all", "@relmify/jest-fp-ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*InMem.ts", "!src/main.ts"],
  reporters: ["default"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  testTimeout: 200000,
  maxWorkers: 1,
  verbose: true,
};

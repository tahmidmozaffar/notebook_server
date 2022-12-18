module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/controllers/**",
    "./src/middlewares/**",
    "./src/routes/**",
    "./src/services/**",
    "./src/utils.ts",
  ],
  coverageThreshold: {
    "global": {
      "lines": 10
    }
  }
};

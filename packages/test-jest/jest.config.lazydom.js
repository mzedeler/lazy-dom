/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-lazy-dom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
}

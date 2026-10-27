/** @type {import('jest').Config} */
module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": ["@swc/jest"],
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/.medusa/", "/dist/"],
  modulePathIgnorePatterns: ["<rootDir>/.medusa/"],
}

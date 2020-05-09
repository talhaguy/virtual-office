module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: [
        "mocks",
        "index.ts",
        "databaseModels",
        "constants.ts",
    ],
}

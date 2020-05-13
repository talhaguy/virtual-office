module.exports = {
    projects: [
        {
            displayName: "Server",
            testMatch: ["<rootDir>/src/**/*.spec.ts"],
            preset: "ts-jest",
            testEnvironment: "node",
            collectCoverageFrom: ["src/**/*.ts"],
            coveragePathIgnorePatterns: [
                "mocks",
                "index.ts",
                "databaseModels",
                "constants.ts",
            ],
        },
        {
            displayName: "Client",
            testMatch: ["<rootDir>/client-src/**/*.spec.(ts|tsx)"],
            preset: "ts-jest",
            testEnvironment: "jsdom",
            collectCoverageFrom: ["client-src/**/*.(ts|tsx)"],
            coveragePathIgnorePatterns: [
                "mocks",
                "index.ts",
                "index.tsx",
                "constants.ts",
            ],
            setupFilesAfterEnv: ["<rootDir>/client-src/setupTests.ts"],
        },
    ],
}

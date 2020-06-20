module.exports = {
    projects: [
        {
            displayName: "Server",
            testMatch: ["<rootDir>/src/**/*.spec.ts"],
            preset: "ts-jest",
            testEnvironment: "node",
            collectCoverage: true,
            collectCoverageFrom: ["src/**/*.ts"],
            coveragePathIgnorePatterns: [
                "mocks",
                "index.ts",
                "databaseModels",
                "constants.ts",
                "models",
            ],
        },
        {
            displayName: "Shared",
            testMatch: ["<rootDir>/shared-src/**/*.spec.ts"],
            preset: "ts-jest",
            testEnvironment: "node",
            collectCoverage: true,
            collectCoverageFrom: ["shared-src/**/*.ts"],
            coveragePathIgnorePatterns: [
                "mocks",
                "index.ts",
                "databaseModels",
                "constants.ts",
                "models",
            ],
        },
        {
            displayName: "Client",
            testMatch: ["<rootDir>/client-src/**/*.spec.(ts|tsx)"],
            preset: "ts-jest",
            testEnvironment: "jsdom",
            collectCoverage: true,
            collectCoverageFrom: ["client-src/**/*.(ts|tsx)"],
            coveragePathIgnorePatterns: [
                "mocks",
                "index.ts",
                "index.tsx",
                "constants.ts",
            ],
            setupFilesAfterEnv: ["<rootDir>/client-src/setupTests.ts"],
            globals: {
                // from https://github.com/facebook/jest/issues/10024#issuecomment-632268333
                "ts-jest": {
                    diagnostics: false,
                },
            },
            moduleNameMapper: {
                "\\.css$": "<rootDir>/__mocks__/styleMock.js",
            },
        },
    ],
}

// TODO: figure out why files don't report code coverage missing for untested files like the following config does
//
// module.exports = {
//     testMatch: ["<rootDir>/src/**/*.spec.ts"],
//     preset: "ts-jest",
//     testEnvironment: "node",
//     collectCoverage: true,
//     collectCoverageFrom: ["src/**/*.ts"],
//     coveragePathIgnorePatterns: [
//         "mocks",
//         "index.ts",
//         "databaseModels",
//         "constants.ts",
//     ],
// }

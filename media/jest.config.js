module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: [
        "./src/test/setup.ts"
    ],
    collectCoverage: true,
    coverageReporters: ["html", "lcov", "text-summary"]
}
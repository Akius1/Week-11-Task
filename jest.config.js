module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // moduleNameMapper: {
  //   "@exmpl/(.*)": "<rootDir>/src/$1",
  // },
  setupFilesAfterEnv: ["./jest.setup.js"],
};
jest.setTimeout(30000);
